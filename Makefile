# Common makefile commands & variables between projects
include .make/common.mk

# Common aws commands & variables between projects
include .make/aws.mk

## Not defined? Use default repo name which is the application
ifeq ($(REPO_NAME),)
	REPO_NAME="bux-console"
endif

## Not defined? Use default repo owner
ifeq ($(REPO_OWNER),)
	REPO_OWNER="BuxOrg"
endif

## Default branch
ifndef REPO_BRANCH
	override REPO_BRANCH="master"
endif

.PHONY: clean release test

clean: ## Remove previous builds and any test cache data
	@npm run clean
	@if [ -d $(DISTRIBUTIONS_DIR) ]; then rm -r $(DISTRIBUTIONS_DIR); fi
	@if [ -d build ]; then rm -r build; fi
	@if [ -d build_cache ]; then rm -r build_cache; fi
	@if [ -d node_modules ]; then rm -r node_modules; fi
