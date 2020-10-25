import { Component, OnInit } from '@angular/core';
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
export class AppComponent implements OnInit {
  genders = ['male', 'female'];
  signUpForm: FormGroup;
  formInputList: FieldConfig[] = [];
  createEntityForm = new FormGroup({});
  xmlInp: string;
  file: any;
  xmlInputString: any = '';
  subOrdinateStack: SubOrdinateInformation[] = [];
  key: number;
  groupInformationStack: GroupInformation[] = [];
  groupList: GroupInformation[] = [];
  populateform: boolean = false;
  ngOnInit() {

    let ff = new FieldConfig();
    ff.displayLabel = "my input";
    ff.hide = false;
    ff.dataType = "Group"
    // ff.dataType = "String";
    // ff.isEditable = "true";
    ff.key = "sjak";
    // ff.staticValue = 'dhiraj'
    // ff.isMultivalued = 'true';
    // // ff.selectedElement = 'one';
    // ff.attributeValues = ['one', 'two', 'three'];

    ff.children = [];
    let f1 = new FieldConfig();
    f1.displayLabel = 'first name '
    f1.key = 'jka';
    f1.dataType = 'String';
    f1.staticValue = 'abcd';
    f1.isEditable = 'false';
    ff.hide = false;

    let f2 = new FieldConfig();
    f2.dataType = 'String'
    f2.key = 'dadasdas';
    f2.displayLabel = 'last name ';
    f2.staticValue = 'shukls'
    f2.isEditable = 'false';
    ff.children.push(f1);
    ff.children.push(f2);



    let ff1 = new FieldConfig();
    ff1.dataType = 'String';
    ff1.key = 'tyryry';
    ff1.displayLabel = 'last name ';
    ff1.staticValue = 'shukls'
    ff1.isEditable = 'false';

    this.formInputList.push(ff1);
    this.formInputList.push(ff);



    // this.parseXML();
    // this.populateform = false;
    // this.popluateForm();
  }

  public onChange(event): void {
    this.file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      // console.log(fileReader.result);
      this.xmlInputString = fileReader.result;
      this.parseXML();


    }
    // console.log('outer')
    fileReader.readAsText(this.file);

  }
  parseXML() {
    var inp = "<bookstore id='123' name='bookstore'  ><self name='self' /><book>" +
      "<title><ndesc> " +
      "<nestedtitle></nestedtitle></ndesc></title>" +
      "<author>Giada De Laurentiis</author>" +
      "<year>2005</year>" +
      "</book></bookstore>";

    let inp1 = "<definitions>" +
      "<header display-name='Connection Parameters' id='123'/>" +
      "<group>" +
      " <definition display-name='Show connection parameters' id='100' name='connection.parameters.display' type='enum'>" +
      "   <enum-choice display-name='show'>show</enum-choice>" +
      "   <enum-choice display-name='hide'>hide</enum-choice>" +
      "    <value>hide</value>" +
      " </definition>" +

      " <subordinates active-value='def inside sub oridinate 1.1'>" +
      "<definition display-name='firstname' id='102' name='https-port' type='integer'>" +
      "				<description>first defintion</description>" +
      "				<value>7707</value>" +
      "			</definition>" +
      "<definition display-name='def inside sub oridinate 1.2' id='102' name='https-port' type='integer'>" +
      "				<description>Specify the port number to use for HTTPS connections.</description>" +
      "				<value>7707</value>" +
      "			</definition>" +
      "<group>" +
      " <definition display-name='Protocol' id='100' name='connection.parameters.display' type='enum'>" +
      " </definition>" +
      " <subordinates active-value='second sub ordinate' >" +
      " <definition display-name='Driver Configuration Mode' id='104' name='driver-config-mode' type='enum'> " +
      "  <description>Select the mode in which this driver is configured.</description> " +
      " <enum-choice display-name='local'>local</enum-choice> " +
      " <enum-choice display-name='remote'>remote</enum-choice> " +
      "<value>local</value> " +
      "</definition> " +
      "</subordinates>" +
      " </group>" +
      "</subordinates>" +
      " </group>" +
      " </definitions>";
    this.subOrdinateStack = [];
    // this.subOrdinates = [];
    let domParser = new DOMParser();
    let data = domParser.parseFromString(this.xmlInputString, 'text/xml');

    this.recur(data);


    console.log("RECURSION ENDS HERE ------------------------------------");
    console.log(this.groupList);
    console.log(this.formInputList);
    this.populateform = true;
  }



  recur(curnode) {

    if (!curnode)
      return;
    else {
      if (curnode.nodeName === 'definition') {
        this.createDefinition(curnode);
        return;
      }
      if (curnode.nodeName === 'header') {
        console.log("create a header with label :  " + curnode.getAttribute('display-name'))
        this.createDefinition(curnode);
        return;
      }
      else if (curnode.nodeName === 'group') {
        console.log("Group starts here ")
        console.log('create Group with display name(Toggle/dropdown)' + curnode.children[0].getAttribute('display-name'));

        // let groupTag = new GroupInformation();
        // groupTag.startIndex = this.formInputList.length;

        this.createDefinition(curnode.children[0]);
        // let subOrdinates: SubOrdinateInformation[] = [];
        //for multiple subordinates
        for (let i = 1; i < curnode.childElementCount; i++) {
          // let subOrdinate = new SubOrdinateInformation();
          // subOrdinate.startIndex = this.formInputList.length;
          // subOrdinate.subordinateId = curnode.children[i].getAttribute('active-value');
          // this.subOrdinateStack.push(subOrdinate);
          //recur to parse current child of subordinate
          this.recur(curnode.children[i]);
          // let subOrinatePoped = this.subOrdinateStack.pop();
          // subOrinatePoped.endIndex = this.formInputList.length;
          // subOrdinates.push(subOrinatePoped);

        }

        // groupTag.endIndex = this.formInputList.length;
        // groupTag.subOrdinateList = subOrdinates;
        // this.groupList.push(groupTag)
        // console.log("Group ends here --------------");

      }
      else {
        // console.log('For loop for ' + curnode.nodeName);
        for (let i = 0; i < curnode.childElementCount; i++) {
          // console.log('inside loop ' + curnode.nodeName)
          this.recur(curnode.children[i]);
        }
      }
    }
  }
  createDefinition(definitionNode) {


    //   let defintionType = 'String';
    //   let definitionValue = '.';
    //   if (definitionNode.getAttribute('type') === 'integer') {
    //     defintionType = 'Integer';
    //   }
    //   else if (definitionNode.getAttribute('type') === 'string' || definitionNode.getAttribute('type') === 'enum') {
    //     defintionType = 'String';
    //   }
    //   if (definitionNode.getElementsByTagName('value')[0] !== undefined && definitionNode.getElementsByTagName('value')[0].childNodes[0] !== undefined) {
    //     definitionValue = "-   " + definitionNode.getElementsByTagName('value')[0].childNodes[0].nodeValue;
    //   }
    //   console.log("def value" + definitionValue)
    //   // this.key += 1;
    //   // let id = this.key * 10 + 5 * this.key;
    //   this.formInputList.push({
    //     "id": definitionNode.getAttribute('id'), "multiValue": false, "scope": "user", "binding": "static", "type": "String", "displayValue":
    //       definitionNode.getAttribute('display-name'), "entitlementDn": "", "instance": true, "hide": false, "key": definitionNode.getAttribute('id'), "displayLabel": definitionNode.getAttribute('display-name'),
    //     "isMultivalued": false, "dataType": defintionType, "isEditable": true, "parentType": "resource", "staticValue": definitionValue
  }
  // );


  // }



  // popluateForm() {

  //   this.formInputList = [{ "id": "param2", "multiValue": false, "scope": "user", "binding": "static", "localizedDisplayValues": [{ "locale": "zh_CN", "name": "" }, { "locale": "pt", "name": "" }, { "locale": "fr", "name": "" }, { "locale": "ru", "name": "" }, { "locale": "zh_TW", "name": "" }, { "locale": "ja", "name": "" }, { "locale": "it", "name": "" }, { "locale": "da", "name": "" }, { "locale": "de", "name": "" }, { "locale": "es", "name": "" }, { "locale": "en", "name": "Field Label 1" }, { "locale": "nb", "name": "" }, { "locale": "sv", "name": "" }, { "locale": "cs", "name": "" }, { "locale": "nl", "name": "" }], "type": "String", "displayValue": "Field Label 1", "entitlementDn": "", "instance": true, "hide": false, "key": "param2", "displayLabel": "Field Label 1", "isMultivalued": false, "dataType": "String", "isEditable": true, "parentType": "resource" }, { "id": "param1", "multiValue": false, "scope": "user", "binding": "dynamic", "localizedDisplayValues": [{ "locale": "zh_CN", "name": "" }, { "locale": "pt", "name": "" }, { "locale": "fr", "name": "" }, { "locale": "ru", "name": "" }, { "locale": "zh_TW", "name": "" }, { "locale": "ja", "name": "" }, { "locale": "it", "name": "" }, { "locale": "da", "name": "" }, { "locale": "de", "name": "" }, { "locale": "es", "name": "" }, { "locale": "en", "name": "apply changes" }, { "locale": "nb", "name": "" }, { "locale": "sv", "name": "" }, { "locale": "cs", "name": "" }, { "locale": "nl", "name": "" }], "type": "Boolean", "displayValue": "apply changes", "entitlementDn": "", "instance": true, "hide": false, "key": "param1", "displayLabel": "apply changes", "isMultivalued": false, "dataType": "Boolean", "isEditable": true, "parentType": "resource" }, { "id": "param3", "multiValue": false, "scope": "user", "binding": "static", "localizedDisplayValues": [{ "locale": "zh_CN", "name": "" }, { "locale": "pt", "name": "" }, { "locale": "fr", "name": "" }, { "locale": "ru", "name": "" }, { "locale": "zh_TW", "name": "" }, { "locale": "ja", "name": "" }, { "locale": "it", "name": "" }, { "locale": "da", "name": "" }, { "locale": "de", "name": "" }, { "locale": "es", "name": "" }, { "locale": "en", "name": "Field Label 2" }, { "locale": "nb", "name": "" }, { "locale": "sv", "name": "" }, { "locale": "cs", "name": "" }, { "locale": "nl", "name": "" }], "type": "Integer", "displayValue": "Field Label 2", "entitlementDn": "", "instance": true, "hide": false, "key": "param3", "displayLabel": "Field Label 2", "isMultivalued": false, "dataType": "Integer", "isEditable": true, "parentType": "resource" }, { "id": "param4", "multiValue": false, "scope": "user", "binding": "static", "localizedDisplayValues": [{ "locale": "zh_CN", "name": "" }, { "locale": "pt", "name": "" }, { "locale": "fr", "name": "" }, { "locale": "ru", "name": "" }, { "locale": "ja", "name": "" }, { "locale": "zh_TW", "name": "" }, { "locale": "it", "name": "" }, { "locale": "da", "name": "" }, { "locale": "de", "name": "" }, { "locale": "es", "name": "" }, { "locale": "en", "name": "Field Label 3" }, { "locale": "nb", "name": "" }, { "locale": "sv", "name": "" }, { "locale": "cs", "name": "" }, { "locale": "nl", "name": "" }], "type": "String", "displayValue": "Field Label 3", "entitlementDn": "", "staticValue": "ram", "instance": true, "hide": false, "key": "param4", "displayLabel": "Field Label 3", "isMultivalued": false, "dataType": "String", "isEditable": true, "parentType": "resource" }];
  // }

  onSubmit() {
    console.log('hello')
    console.log(this.signUpForm)
  }

  onAddHobby() {
    console.log("add hobby");
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.signUpForm.get('hobbies')).push(control);

  }







}
