import { PermissionsWidgetsModule } from './permissions-widgets.module';

describe('PermissionsWidgetsModule', () => {
  let permissionsWidgetsModule: PermissionsWidgetsModule;

  beforeEach(() => {
    permissionsWidgetsModule = new PermissionsWidgetsModule();
  });

  it('should create an instance', () => {
    expect(permissionsWidgetsModule).toBeTruthy();
  });
});
