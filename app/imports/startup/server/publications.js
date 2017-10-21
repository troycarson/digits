import { Contacts } from '../../api/contacts/contacts.js';
import { Meteor } from 'meteor/meteor';

Meteor.publish('Contacts', function publishContactData() {
  return Contacts.find();
});