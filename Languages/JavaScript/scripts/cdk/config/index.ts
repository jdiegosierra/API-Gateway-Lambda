const defaultConfig: object = require('./default.json')


const ENV: string|undefined = process.env.ENV || process.env.AWS_PROFILE

const envConfig: object = require(`./envs.json`)[ENV!]

interface IConfig {
    ENV: string,
    account: string,
    lambdaPrefix: string,
    regions: { main: string, failOver?: string },
    domain: string
}

const config: IConfig = <IConfig>{ ENV, ...defaultConfig, ...envConfig }

export default config;

