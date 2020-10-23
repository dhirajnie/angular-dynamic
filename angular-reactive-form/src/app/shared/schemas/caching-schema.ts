export class FlushCache{
    cacheArraySize : any;
    cacheHolders : any[];
}
export class ClusterCacheConfiguration{
    permIndexClusterEnabled : any;
    clusterEnabled : any;
    groupID :any;
    permIndexGroupID: any;
    clusterProps : any;
    permIndexClusterProps: any;
    lockAcquTimeout : any;
    evictionPolicyClass : any;
    wakeUpIntervalSeconds : any;
    maxNodes : any;
    timeToLiveSeconds : any;
    localClusterEnabled : any;
    localGroupID : any;
    localClusterProps : any;
    localLockAcquTimeout : any;
    localEvictionPolicyClass : any;
    localWakeUpIntervalSeconds : any;
    localMaxNodes : any;
    localTimeToLiveSeconds : any;
    lockAcquCurrentTimeout: any;
    currentWakeUpInterval: any;
    currentEvictionPolicyClass: any;
    currentGroupID: any;
    currentPermIndexGroupID: any;
    clusterCurrentProps: any;
    clusterPermIndexCurrentProps: any;
    currentMaxNodes: any;
    currentTimeToLive: any;
    clusterEnabledCurrentValue: any;
    permIndexClusterEnabledCurrentValue: any;
}
export class CustomizedCacheHolderConfig
{
  public  maxnodesCurrent: any;
  public  globalMaxnodes: any;
  public  localMaxnodes:any;
  public  timetoliveCurrent:any;
  public  globalTimetolive: any;
  public loacalTimetolive: any;
  public maxageCurrent: any;
  public globalMaxage: any;
  public localMaxage: any;
  public cacheEnable: any;
  public cacheReadonly: any;
  public cacheValue: any;
  public enableLocalMaxnodes: any;
  public enableLocalMaxage:any;
  public enableLocalTimetolive: any;
}
