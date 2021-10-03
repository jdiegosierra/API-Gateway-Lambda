module.exports = (grunt) => {
  require('grunt-contrib-copy')(grunt);

  const lambdaFunctions = [
    'hellow-world',
  ];

  const ENVIRONMENTS = ['dev', 'test', 'prod'];
  const fileLists = {};

  function addFileToList(section, options) {
    if (!fileLists[section]) fileLists[section] = { files: [] };
    fileLists[section].files.push({ expand: true, ...options });
  }

  lambdaFunctions.forEach((lambda) => {
    addFileToList('errors', {
      cwd: 'base',
      src: ['errors/**'],
      dest: `${lambda}/`,
    });
    ENVIRONMENTS.forEach((env) => {
      addFileToList(`config-${env}`, {
        cwd: `base/configs/${env}/`,
        src: ['**'],
        dest: `${lambda}/configs/`,
      });
    });
  });

  ENVIRONMENTS.forEach((env) => {
    addFileToList(`config-${env}`, {
      cwd: `base/configs/${env}/`,
      src: ['**'],
      dest: 'base/configs',
    });
  });

  grunt.initConfig({ copy: fileLists });

  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['copy:errors']);

  grunt.registerTask('errors', ['copy:errors']);

  ENVIRONMENTS.forEach((env) => {
    const capitalizedEnv = env.charAt(0).toUpperCase() + env.slice(1);
    grunt.registerTask(`init${capitalizedEnv}`, [
      'copy:errors',
      `copy:config-${env}`,
    ]);
  });
};
