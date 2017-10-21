import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { Contacts, ContactsSchema } from '../../api/contacts/contacts.js';

/* eslint-disable no-param-reassign */

const displayErrorMessages = 'displayErrorMessages';

Template.Add_Contact_Page.onCreated(function onCreated() {
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displayErrorMessages, false);
  this.context = ContactSchema.namedContext('Add_Contact_Page');
});

Template.Add_Contact_Page.helpers({
  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
  fieldError(fieldName) {
    const invalidKeys = Template.instance().context.invalidKeys();
    const errorObject = _.find(invalidKeys, (keyObj) => keyObj.name === fieldName);
    return errorObject && Template.instance().context.keyErrorMessage(errorObject.name);
  },
});


Template.Add_Contact_Page.events({
  'submit .contact-data-form'(event, instance) {
    event.preventDefault();
    // Get name (text field)
    const name = event.target.Name.value;
    // Get bio (text area).
    const bio = event.target.Bio.value;
    // Get hobbies (checkboxes, zero to many)
    const hobbies = [];
    _.each(hobbyList, function setHobby(hobby) {
      if (event.target[hobby].checked) {
        hobbies.push(event.target[hobby].value);
      }
    });
    // Get level (radio buttons, exactly one)
    const level = event.target.Level.value;
    // Get GPA (single selection)
    const gpa = event.target.GPA.value;
    // Get Majors (multiple selection)
    const selectedMajors = _.filter(event.target.Majors.selectedOptions, (option) => option.selected);
    const majors = _.map(selectedMajors, (option) => option.value);

    const newStudentData = { name, bio, hobbies, level, gpa, majors };
    // Clear out any old validation errors.
    instance.context.reset();
    // Invoke clean so that newStudentData reflects what will be inserted.
    const cleanData = StudentDataSchema.clean(newStudentData);
    // Determine validity.
    instance.context.validate(cleanData);
    if (instance.context.isValid()) {
      const id = StudentData.insert(cleanData);
      instance.messageFlags.set(displaySuccessMessage, id);
      instance.messageFlags.set(displayErrorMessages, false);
      instance.find('form').reset();
      instance.$('.dropdown').dropdown('restore defaults');
    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});
