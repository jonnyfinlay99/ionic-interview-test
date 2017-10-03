import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { AgeValidator } from '../../validators/age';
import { UsernameValidator } from '../../validators/username';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('signupSlider') signupSlider: any;

  slideOneForm: FormGroup;
  slideTwoForm: FormGroup;

  submitAttempt: boolean = false;

  constructor(public navCtrl: NavController, public formBuilder: FormBuilder, public http: Http) {



    this.http = http;
    //Create a form on slide one and initialise its values and set its validations requirements
    //Form 1 should have a firstName and a lastName and an age
    //Ensure that firstName has a maxLength of 30 and is a-zA-zA
    //Same for lastName
    //Use the Age Validator to check if the age is valid, anyone under 18 cannot partake,



    this.slideOneForm = formBuilder.group({
      firstName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      lastName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      age: ['', AgeValidator.isValid]
    });



    //this second form requires a username to be validated against a pattern and a valid username check
    //the second field is privacy ensure that it is required.
    //the final field bio is not required.

    this.slideTwoForm = formBuilder.group({
      username: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z]*')]), UsernameValidator.checkUsername],
      privacy: ['', Validators.required],
      bio: ['']
    });

  }

  next() {
    this.signupSlider.slideNext();
  }

  prev() {
    this.signupSlider.slidePrev();
  }

  save() {

    this.submitAttempt = true;

    if (!this.slideOneForm.valid) {
      this.signupSlider.slideTo(0);
    }
    else if (!this.slideTwoForm.valid) {
      this.signupSlider.slideTo(1);
    }
    else {
      console.log("success!");

      console.log(this.slideOneForm.value);
      console.log(this.slideTwoForm.value);


      //Send the form data to a function that will send the post data to an api
      this.postData(this.slideOneForm.value, this.slideTwoForm.value)



    }






  }
  postData(formOne, formTwo) {
    var link = 'http://fakeapi.com/api/form';
    let body = new FormData();
    //append the form data to matching keys e.g: firstName, lastName etc.

    body.append('firstName', formOne.firstName);
    body.append('lastName', formOne.lastName);
    body.append('age', formOne.age);

    body.append('username', formTwo.username);
    body.append('privacy', formTwo.privacy);
    body.append('bio', formTwo.bio);


    //return the post request and map the res.json
    return this.http
      .post(link, body)
      .map(res => res.json());
  }
}