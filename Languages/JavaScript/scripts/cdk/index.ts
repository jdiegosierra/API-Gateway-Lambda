import { App } from '@aws-cdk/core';
import { createApiStack } from '@yourcompany/cdk';
import { execFileSync } from 'child_process';
import * as path from 'path';
import config from './config';


(() => {
  const app: App = new App();
  const mainRegion = config.regions.main;
  const failOverRegion = config.regions.failOver;
  const { account } = config;
  const lambdasPath = path.resolve(`${__dirname}/../../lambdas`);
  const sharedLayerPath = path.resolve(`${__dirname}/../../lambdas/node_modules`);
  // @ts-ignore
  const capitalizedEnv = process.env.AWS_PROFILE.charAt(0).toUpperCase() + process.env.AWS_PROFILE.slice(1);

  execFileSync('yarn', ['run', 'grunt', `init${capitalizedEnv}`], { cwd: lambdasPath });
  execFileSync('yarn', ['install', '--production', '--frozen-lockfile'], { cwd: lambdasPath });
  createApiStack('hellow-world', app, account, mainRegion, lambdasPath, sharedLayerPath);
  if (failOverRegion) {
    createApiStack('hellow-world', app, account, failOverRegion, lambdasPath, sharedLayerPath);
  }
})();




