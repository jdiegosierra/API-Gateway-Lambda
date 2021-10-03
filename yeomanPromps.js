module.exports = async function () {
    const { projectLanguage } = await this.prompt([
        {
            message: 'Choose a language for your project:',
            type: 'list',
            name: 'projectLanguage',
            choices: ['JavaScript']
        }
    ]);

    this.fs.copy(
        this.templatePath + '/' + this.project.name + '-master/Languages/' + projectLanguage,
        this.destinationPath,
        { globOptions: { dot: true } }
    );

    const { hasPipelines } = await this.prompt([
        {
            type: 'confirm',
            name: 'hasPipelines',
            message: 'Would you like pipelines in your project?'
        }
    ]);

    if (hasPipelines) {
        this.fs.copy(
            this.templatePath + '/' + this.project.name + '-master/Pipelines/Gitlab',
            this.destinationPath,
            { globOptions: { dot: true } }
        );
    }
}
