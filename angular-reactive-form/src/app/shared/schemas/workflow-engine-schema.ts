export class WorkflowEngineConfiguration {
    public minPoolSize: number;
    public maxPoolSize: number;
    public initialPoolSize: number;
    public keepAliveTime: number;
    public userActivityTimeout: number;
    public completedProcessTimeout: number;
    public webServiceActivityTimeout: number;
    public pendingInterval: number;
    public cleanupInterval: number;
    public retryQueueInterval: number;
    public maxShutdownTime: number;
    public enableEmailNotification: boolean;
    public processCacheInitialCapacity: number;
    public processCacheMaxCapacity: number;
    public processCacheLoadFactor: number;
    public heartbeatInterval: number;
    public heartbeatFactor: number;
}
// tslint:disable-next-line:max-classes-per-file
export class WorkflowEngineState {
    public engineId: any;
    public engineState: any;
}
