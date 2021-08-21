.PHONY: coverage
coverage:
	@deno test --allow-all --unstable --coverage=cov
	@deno coverage cov
	@rm -rf cov

.PHONY: test
test:
	@deno test --allow-all --unstable

.PHONY: update-deps
update-deps:
	@udd denops/template/deps.ts
