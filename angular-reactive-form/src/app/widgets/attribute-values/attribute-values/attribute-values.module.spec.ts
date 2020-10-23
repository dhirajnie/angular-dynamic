import { AttributeValuesModule } from './attribute-values.module';

describe('AttributeValuesModule', () => {
  let attributeValuesModule: AttributeValuesModule;

  beforeEach(() => {
    attributeValuesModule = new AttributeValuesModule();
  });

  it('should create an instance', () => {
    expect(attributeValuesModule).toBeTruthy();
  });
});
