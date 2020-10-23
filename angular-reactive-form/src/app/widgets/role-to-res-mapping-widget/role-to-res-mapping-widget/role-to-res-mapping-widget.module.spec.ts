import { RoleToREsMappingWidgetModule } from './role-to-res-mapping-widget.module';

describe('RoleToREsMappingWidgetModule', () => {
  let roleToREsMappingWidgetModule: RoleToREsMappingWidgetModule;

  beforeEach(() => {
    roleToREsMappingWidgetModule = new RoleToREsMappingWidgetModule();
  });

  it('should create an instance', () => {
    expect(roleToREsMappingWidgetModule).toBeTruthy();
  });
});
