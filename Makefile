SHELL := bash

# ----------------------------------------- VARIABLES -----------------------------------------------------------------

SCRIPT_VERSION=0.0.1
lambdas_dir=./lambdas/

# ---------------------------------------------------------------------------------------------------------------------

HELP_FUN = \
    %help; while(<>){push@{$$help{$$2//'options'}},[$$1,$$3] \
    if/^([\w-_]+)\s*:.*\#\#(?:@(\w+))?\s(.*)$$/}; \
    print"$$_:\n", map"  $$_->[0]".(" "x(20-length($$_->[0])))."$$_->[1]\n",\
    @{$$help{$$_}},"\n" for keys %help; \

.PHONY: help
help: ##@Miscellaneous Show this help
	@echo -e "Usage: make [target] ...\n"
	@echo -e "Notes:\n  DISABLE_CHECKS=true variable must be used only on CI\n"
	@perl -e '$(HELP_FUN)' $(MAKEFILE_LIST)
	@echo -e "Version $(SCRIPT_VERSION)"

#ENABLE MULTI-COMMAND
RUN_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
$(eval $(RUN_ARGS):;@:)
run-args:
# ---------------------------------------------------------------------------------------------------------------------
# FUNCTIONS

define check_protected_env
	if [ "${AWS_PROFILE}" != "prod" ] || [ "${DISABLE_CHECKS}" == "true" ]; then \
		echo "${AWS_PROFILE}"; \
	else \
		echo "Are you sure to deploy on Production? [yes/no]:"; \
		read RESULT; \
		if [[ $$RESULT != "yes" ]]; then \
        	exit 1; \
		fi \
	fi
endef

define check_aws_profile
	if [ -z ${AWS_PROFILE} ]; \
	then \
		echo "AWS_PROFILE must be defined: AWS_PROFILE=xxx make message [command]"; \
		exit 1; \
	else \
		echo "Environment: ${AWS_PROFILE}"; \
	fi
endef

define launch_cdk
	if [ "${1}" == "deploy" ]; then \
		$(call check_protected_env); \
	fi \
	&& cd scripts/cdk \
	&& if [ "${2}" == "" ]; then \
		yarn cdk $1 $2 --require-approval never; \
	else \
		yarn cdk $1 * --require-approval never; \
	fi
endef

.PHONY: lint
lint: ##@Tests Lint diff with staging
	git pull origin staging
	yarn run lint-diff origin/staging

.PHONY: unit-tests
unit-tests: ##@Tests Run unit tests
	cd ./lambdas && yarn install; \
	yarn run grunt initLocal
	yarn run test unit


.PHONY: integration-tests
integration-tests: ##@Tests Run integration tests
	cd ./lambdas && yarn install; \
	yarn run grunt initLocal
	yarn run test integration

.PHONY: tests
tests: ##@Tests Run integration and unit tests
	cd ./lambdas && yarn install; \
	yarn run grunt initLocal
	yarn run test

.PHONY: build
build: ##@Commands Build Project
	yarn install
	(cd lambdas && yarn install)
	(cd scripts/cdk && yarn install)

.PHONY: cdk
cdk: run-args ##@Commands CDK
	@$(call check_aws_profile)
	@make build
	@args=(`echo ${RUN_ARGS} | sed 's/ /\n/g'`) \
	&& echo $${args[1]} \
	&& $(call launch_cdk,$${args[0]},$${args[1]})

.PHONY: audit
audit: ##@Security Generate vulnerabilities reports
	npm install -g npm-audit-html
	npm install -g npm-audit-markdown
	for d in ./lambdas/*/; do \
	    (cd $$d; \
	        if [[ -f "package-lock.json" ]]; \
	        then \
	            echo $$d; \
	            export dirname=$${d#./lambdas/}; \
	            export dirname=$${dirname%/}; \
	            echo $$dirname; \
	            npm install; \
	            npm audit --json | npm-audit-html --output report.html; \
	            npm audit --json | npm-audit-markdown --output report.md; \
	            echo $(CURDIR); \
	            mv report.html $(CURDIR)/.gitlab/reports/helpers/html/report_$$dirname.html ; \
	            mv report.md $(CURDIR)/.gitlab/reports/helpers/markdown/report_$$dirname.md ; \
	        fi \
	    ) \
	done

	cd .gitlab/reports/helpers/html && node index.js
