export class LoggingConfig {
    public enableLogLevelForAll: boolean;
    public logLevelForAll: string;
    public enableAudit: boolean;
    public enableCEF: boolean;
    public persist: boolean;
    public logConfigurations: any;
    public cefConfigs: CEFConfig;
}

export class CEFConfig {
    public destinationHost: String;
    public destinationPort: Number;
    public protocol: String;
    public useTLS: boolean;
    public keyStorePath: String;
    public keyStorePWD: String;
    public intermediateStoragePath: String;
}
