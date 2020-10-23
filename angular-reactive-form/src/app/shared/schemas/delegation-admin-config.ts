export class DelegationAdminConfig {
  public allRequests: boolean;
  public delegateNotfTemplate: string;
  public delegationRetentionTime: number;
  public availabilityNotfTemplate: string;
  public availabilityRetentionTime: number;
}

export class ProxyAdminConfig {
  public proxyNotfTemplate: string;
  public proxyRetentionTime: number;
}

export class CleanupServiceConfig {
  public cleanUpSeviceActivationInteval: number;
  public syncServiceActivationInterval: number;
  public lastCleanUpDate: number;
  public scheduledCleanUpDate: number;
  public cleanupChoice: string;
}
