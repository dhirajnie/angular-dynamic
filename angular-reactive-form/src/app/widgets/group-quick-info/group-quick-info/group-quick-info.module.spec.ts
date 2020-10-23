import { GroupQuickInfoModule } from './group-quick-info.module';

describe('GroupQuickInfoModule', () => {
  let groupQuickInfoModule: GroupQuickInfoModule;

  beforeEach(() => {
    groupQuickInfoModule = new GroupQuickInfoModule();
  });

  it('should create an instance', () => {
    expect(groupQuickInfoModule).toBeTruthy();
  });
});
