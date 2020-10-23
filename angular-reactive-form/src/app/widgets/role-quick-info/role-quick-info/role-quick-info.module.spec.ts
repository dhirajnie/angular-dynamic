import { RoleQuickInfoModule } from './role-quick-info.module';

describe('RoleQuickInfoModule', () => {
  let roleQuickInfoModule: RoleQuickInfoModule;

  beforeEach(() => {
    roleQuickInfoModule = new RoleQuickInfoModule();
  });

  it('should create an instance', () => {
    expect(roleQuickInfoModule).toBeTruthy();
  });
});
