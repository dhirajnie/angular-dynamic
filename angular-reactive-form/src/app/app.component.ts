import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { formArrayNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';
import * as _ from 'lodash';
import { FieldConfig } from './dynamic-form/models/field-config.schema';
import { GroupInformation } from './GrounpInformation';
import { SubOrdinateInformation } from './SubOrdinateInformation';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  genders = ['male', 'female'];
  signUpForm: FormGroup;
  driverOptionsFormConfig: FieldConfig[] = [];
  publisherOptionsFormConfig: FieldConfig[] = [];
  subscriberOptionsFormConfig: FieldConfig[] = [];
  createEntityForm = new FormGroup({});
  xmlInp: string;
  file: any;
  xmlInputString: any = '';
  subOrdinateStack: SubOrdinateInformation[] = [];
  key: number = 0;
  groupInformationStack: GroupInformation[] = [];
  groupList: GroupInformation[] = [];
  populateform: boolean = false;
  showDynForm: boolean = false;
  ngOnInit() {
    let group = new FieldConfig();
    group.key = this.key.toString();
    group.dataType = "Group"
    // let definition = new FieldConfig();

    // definition.key = this.key.toString();
    // definition.dataType = "String";
    // definition.hide = false;
    // // definition.staticValue = 'abcd';
    // definition.displayLabel = 'first name '
    // definition.attributeValues = ['asv', 'a'];
    // definition.choiceList = [{ "key": 'key1', "value": 'dp name' }, { "key": 'key2', "value": 'dp xyz' }];
    // definition.controlType = 'fg';
    // definition.isMultivalued = 'false';
    // definition.isEditable = 'true';

    // let sub1 = new FieldConfig();
    // sub1.subOridinateActiveValue = 'dp name'
    // sub1.dataType = 'Subordinates';
    // sub1.key = this.key.toString();
    // sub1.hide = false;


    // let sub2 = new FieldConfig();
    // sub2.subOridinateActiveValue = 'dp xyz'
    // sub2.dataType = 'Subordinates';
    // sub2.key = this.key.toString();
    // sub2.hide = false;


    // group.children.push(sub1);
    // group.children.push(sub2);

    // this.showDynForm = true;

  }

  fileUp(event) {
    this.file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = (e) => {

      this.xmlInputString = fileReader.result;
      this.parseXML();
    }
    // console.log('outer')
    fileReader.readAsText(this.file);

  }
  parseXML() {
    let domParser = new DOMParser();
    let data = domParser.parseFromString(this.xmlInputString, 'application/xml');
    let driverOptionsXML = data.getElementsByTagName('driver-options')[0];
    let driverOptionsFormConfig = { elementType: 'definitions', children: [] };
    this.recur(driverOptionsXML, driverOptionsFormConfig);
    // this.driverOptions = driverParentOptions;
    console.log('-----------------------------------');
    console.log(driverOptionsFormConfig);

    console.log('---------------------------------------');
    let subscriberOptionsXML = data.getElementsByTagName('subscriber-options')[0];
    let subscriberOptions = { elementType: 'definitions', children: [] };
    this.recur(subscriberOptionsXML, subscriberOptions);
    console.log(subscriberOptions);
    console.log('--------------------------------------');


    let publisherOptionsXML = data.getElementsByTagName('publisher-options')[0];
    let publisherOptions = { elementType: 'definitions', children: [] };

    this.recur(publisherOptionsXML, publisherOptions);
    console.log(publisherOptions);



    this.driverOptionsFormConfig.push(...driverOptionsFormConfig.children);
    this.subscriberOptionsFormConfig.push(...subscriberOptions.children);
    this.publisherOptionsFormConfig.push(...publisherOptions.children)

    this.showDynForm = true;
    console.log('--------------------')
    console.log(data)

  }

  recur(curXMLNode, parentElement) {

    if (!curXMLNode) {
      return;
    }
    else {
      curXMLNode.setAttribute("id", this.key);
      ++this.key;
      if (curXMLNode.nodeName === 'definition') {
        parentElement.children.push(this.createDefinition(curXMLNode));
        return;
      }
      else if (curXMLNode.nodeName === 'header') {
        parentElement.children.push(this.createHeader(curXMLNode));
        return;
      }
      else {

        if (curXMLNode.nodeName === 'group') {
          let group = this.createGroup(curXMLNode);
          parentElement.children.push(group);
          parentElement = group;
        }
        if (curXMLNode.nodeName === 'subordinates') {
          let subordinates = this.createSubordinates(curXMLNode);

          parentElement.children.push(subordinates);
          parentElement = subordinates;
        }
        for (let i = 0; i < curXMLNode.childElementCount; i++) {
          // console.log('inside loop ' + curnode.nodeName)
          this.recur(curXMLNode.children[i], parentElement);
        }
      }
    }
  }
  createGroup(curXMLNode) {
    let fielConfig = new FieldConfig();
    fielConfig.key = curXMLNode.getAttribute("id")
    fielConfig.dataType = 'Group';
    return fielConfig;
  }

  createSubordinates(curXMLNode) {
    let fielConfig = new FieldConfig();
    fielConfig.key = curXMLNode.getAttribute("id")
    fielConfig.dataType = 'Subordinates';
    fielConfig.subOridinateActiveValue = curXMLNode.getAttribute('active-value');


    // subordinates.id = this.key.toString();
    // ++this.key;
    // subordinates.elementType = 'subordinates';
    // subordinates.activeValue = curXMLNode.getAttribute('active-value');
    return fielConfig;
  }
  createDefinition(curXMLNode): FieldConfig {

    let structuredDef = new FieldConfig();
    if (curXMLNode.getAttribute('type') === 'structured') {
      structuredDef.dataType = 'StructuredDefinition';

      for (let i = 0; i < curXMLNode.childElementCount; i++) {
        if (curXMLNode.children[i].nodeName === 'value') {
          let valueNode = curXMLNode.children[i];

          for (let k = 0; k < valueNode.childElementCount; k++) {
            let templateDef = new FieldConfig();
            templateDef.dataType = 'StructuredInstance';
            let instanceNode = valueNode.children[k];
            for (let j = 0; j < instanceNode.childElementCount; j++) {
              templateDef.children.push(this.createBasicDef(instanceNode.children[j]));
            }
            structuredDef.children.push(templateDef);
          }
        }
        else if (curXMLNode.children[i].nodeName === 'template') {

        }
      }

      return structuredDef;
    }

    return this.createBasicDef(curXMLNode);


  }
  createBasicDef(curXMLNode): FieldConfig {

    let definition = new FieldConfig();
    definition.key = curXMLNode.getAttribute("id");
    // definition.dataType = "String";
    definition.hide = false;
    ++this.key;

    if (curXMLNode.getAttribute('type') === 'string') {
      definition.dataType = "String";
    }
    else if (curXMLNode.getAttribute('type') === 'integer') {
      definition.dataType = "Integer";
    }
    else if (curXMLNode.getAttribute('type') === 'password-ref') {
      definition.dataType = 'Password';
    }
    else if (curXMLNode.getAttribute('type') === 'enum') {

      let choicesList = new Array<{ key: string, value: string }>();
      let enumChoicesXML = curXMLNode.getElementsByTagName('enum-choice');
      for (let i = 0; i < enumChoicesXML.length; i++) {
        let displayName = enumChoicesXML[i].getAttribute('display-name');
        let enumValue = enumChoicesXML[i].childNodes[0].nodeValue;
        choicesList.push({ key: enumValue, value: displayName });
        definition.dataType = "String";
      }
      definition.choiceList = choicesList;
      definition.controlType = 'fg';

    }
    definition.isMultivalued = 'false';
    definition.isEditable = 'true';
    definition.displayLabel = curXMLNode.getAttribute('display-name');
    // definition.dataType = curXMLNode.getAttribute('type');

    if (curXMLNode.getElementsByTagName('value')[0] !== undefined && curXMLNode.getElementsByTagName('value')[0].childNodes[0] !== undefined)
      definition.attributeValues = curXMLNode.getElementsByTagName('value')[0].childNodes[0].nodeValue;
    else {
      definition.attributeValues = '';
    }
    // if (curXMLNode.getElementsByTagName('description')[0] !== undefined && curXMLNode.getElementsByTagName('description')[0].childNodes[0] !== undefined)
    // definition.definitionDescription = curXMLNode.getElementsByTagName('description')[0].childNodes[0].nodeValue;
    return definition;
  }
  createHeader(curXMLNode) {
    let header = new FieldConfig();
    header.key = curXMLNode.getAttribute("id");
    header.hide = false;

    header.dataType = "String";
    header.displayLabel = curXMLNode.getAttribute('display-name');
    header.staticValue = '';

    return header;
  }

  ngAfterViewInit(): void {

  }


  onSubmit() {

    console.log(this.createEntityForm)
  }
}