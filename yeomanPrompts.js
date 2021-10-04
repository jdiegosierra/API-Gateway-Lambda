let projectLanguage, hasPipelines, projectPipelinesPlatform;

module.exports = {
    async configuring() {
        projectLanguage = (await this.prompt([
            {
                message: 'Choose a language for your project:',
                type: 'list',
                name: 'projectLanguage',
                choices: ['JavaScript']
            }
        ])).projectLanguage;

        hasPipelines = (await this.prompt([
            {
                type: 'confirm',
                name: 'hasPipelines',
                message: 'Would you like pipelines in your project?'
            }
        ])).hasPipelines;

        if (hasPipelines) {
            projectPipelinesPlatform = (await this.prompt([
                {
                    message: 'Choose a platform where you to run your pipelines',
                    type: 'list',
                    name: 'projectPipelinesPlatform',
                    choices: ['Gitlab', 'Github']
                }
            ])).projectPipelinesPlatform;
        }
    },
    writing() {
        this.fs.copy(
            this.templatePath() + '/' + this.project.name + '-master/Languages/' + projectLanguage,
            this.destinationPath(),
            { globOptions: { dot: true } }
        );

        if (projectPipelinesPlatform) {
            this.fs.copy(
                this.templatePath() + '/' + this.project.name + '-master/Pipelines/' + projectPipelinesPlatform,
                this.destinationPath(),
                { globOptions: { dot: true } }
            );
        }
    },
    install() {
        shell.cd(this.destinationPath());
        shell.exec('make build');
    }
}
