import { UserQuickInfoModule } from './user-quick-info.module';

describe('UserQuickInfoModule', () => {
  let userQuickInfoModule: UserQuickInfoModule;

  beforeEach(() => {
    userQuickInfoModule = new UserQuickInfoModule();
  });

  it('should create an instance', () => {
    expect(userQuickInfoModule).toBeTruthy();
  });
});
