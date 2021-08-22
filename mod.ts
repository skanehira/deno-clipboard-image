import { io } from "./deps.ts";

export async function read(): Promise<Deno.Reader> {
  const opts: Deno.RunOptions = {
    cmd: [],
  };

  const tmp = await Deno.makeTempFile();

  switch (Deno.build.os) {
    case "darwin": {
      opts.cmd = [
        "osascript",
        "-e",
        `write (the clipboard as «class PNGf») to (open for access "${tmp}" with write permission)`,
      ];
      break;
    }
    case "linux": {
      opts.cmd = [
        "xclip",
        "-selection",
        "clipboard",
        "-t",
        "image/png",
        "-o",
      ];
      break;
    }
    case "windows": {
      opts.cmd = [
        "PowerShell",
        "-Command",
        "Add-Type",
        "-AssemblyName",
        `System.Windows.Forms;$clip=[Windows.Forms.Clipboard]::GetImage();if ($clip -ne $null) { $clip.Save('${tmp}') };`,
      ];
      break;
    }
  }

  opts.stdout = "piped";
  opts.stderr = "piped";

  const p = Deno.run(opts);
  if (Deno.build.os === "linux") {
    const f = await Deno.open(tmp, { write: true });
    await io.copy(p.stdout as Deno.Reader, f as Deno.Writer);
    f.close();
  }

  const status = await p.status();

  if (!status.success) {
    const decoder = new TextDecoder();
    throw new Error(decoder.decode(await p.stderrOutput()));
  }

  const dst = new io.Buffer();
  const src = await Deno.open(tmp);
  await io.copy(src, dst);
  src.close();

  p.stderr?.close();
  p.stdout?.close();

  p.close();
  return dst;
}

export async function write(src: Deno.Reader): Promise<void> {
  const opts: Deno.RunOptions = {
    cmd: [],
  };

  switch (Deno.build.os) {
    case "darwin": {
      const path = await writeTmp(src);
      opts.cmd = [
        "osascript",
        "-e",
        `set the clipboard to (read "${path}" as TIFF picture)`,
      ];
      break;
    }
    case "linux": {
      opts.cmd = [
        "xclip",
        "-selection",
        "clipboard",
        "-t",
        "image/png",
      ];
      opts.stdin = "piped";
      break;
    }
    case "windows": {
      const path = await writeTmp(src);
      opts.cmd = [
        "PowerShell",
        "-Command",
        "Add-Type",
        "-AssemblyName",
        `System.Windows.Forms;[Windows.Forms.Clipboard]::SetImage([System.Drawing.Image]::FromFile('${path}'));`,
      ];
      break;
    }
  }

  opts.stdout = "piped";
  opts.stderr = "piped";

  const p = Deno.run(opts);
  if (Deno.build.os == "linux") {
    await io.copy(src, p.stdin as Deno.Writer);
  }

  p.stdin?.close();
  p.stderr?.close();
  p.stdout?.close();

  const status = await p.status();
  if (!status.success) {
    throw new Error(new TextDecoder().decode(await p.stderrOutput()));
  }
  p.close();
}

async function writeTmp(src: Deno.Reader): Promise<string> {
  const tmp = await Deno.makeTempFile();
  const dst = await Deno.open(tmp, { write: true });
  await io.copy(src, dst);
  dst.close();
  return tmp;
}
