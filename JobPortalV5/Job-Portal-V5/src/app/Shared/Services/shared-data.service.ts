import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  // Create BehaviorSubjects to store the shared values
  private accountTitleSubject = new BehaviorSubject<string>('');
  private accountNoSubject = new BehaviorSubject<string>('');
  private bankNameSubject = new BehaviorSubject<number>(0);

  // Create Observable streams
  accountTitle$ = this.accountTitleSubject.asObservable();
  accountNo$ = this.accountNoSubject.asObservable();
  bankName$ = this.bankNameSubject.asObservable();


  private fatherFullNameSubject = new BehaviorSubject<string>('');
  private fatherIDCardNoSubject = new BehaviorSubject<string>('');
  private fatherOccupationSubject = new BehaviorSubject<string>('');
  private fatherPhoneNoSubject = new BehaviorSubject<string>('');

  // Observables to subscribe in the other component
  fatherFullName$ = this.fatherFullNameSubject.asObservable();
  fatherIDCardNo$ = this.fatherIDCardNoSubject.asObservable();
  fatherOccupation$ = this.fatherOccupationSubject.asObservable();
  fatherPhoneNo$ = this.fatherPhoneNoSubject.asObservable();


  private emergencyFullNameSubject = new BehaviorSubject<string>('');
  private emergencyPhoneNoSubject = new BehaviorSubject<string>('');


  // Observables to subscribe in other components
  emergencyFullName$ = this.emergencyFullNameSubject.asObservable();
  emergencyPhoneNo$ = this.emergencyPhoneNoSubject.asObservable();

  // BehaviorSubjects for Next of Kin information
  private nextOfKinNameSubject = new BehaviorSubject<string>('');
  private nextOfKinPhoneSubject = new BehaviorSubject<string>('');
  private nextofKinRelationship = new BehaviorSubject<{ Id: string, Name: string }>({ Id: '', Name: '' });

  // Observables to subscribe in other components
  nextOfKinName$ = this.nextOfKinNameSubject.asObservable();
  nextOfKinPhone$ = this.nextOfKinPhoneSubject.asObservable();
  nextOfKinRelationship$ = this.nextofKinRelationship.asObservable();

  // BehaviorSubjects for Dependent Information
  private depenFirstNameSubject = new BehaviorSubject<string>('');
  private depenLastNameSubject = new BehaviorSubject<string>('');
  private depenGenderSubject = new BehaviorSubject<{ Id: string, Name: string }>({ Id: '', Name: '' });
  private depenIdCardNoSubject = new BehaviorSubject<string>('');
  private relationship2Subject = new BehaviorSubject<{ Id: string, Name: string }>({ Id: '', Name: '' });

  // Observables to subscribe in other components
  depenFirstName$ = this.depenFirstNameSubject.asObservable();
  depenLastName$ = this.depenLastNameSubject.asObservable();
  depenGender$ = this.depenGenderSubject.asObservable();
  depenIdCardNo$ = this.depenIdCardNoSubject.asObservable();
  relationship2$ = this.relationship2Subject.asObservable();

  private selectedConveyanceSubject = new BehaviorSubject<{ Id: boolean, Name: string }>({ Id: null, Name: '' });
  private selectedConveyanceTypeSubject = new BehaviorSubject<{ Id: string, Name: string }>({ Id: '', Name: '' });
  private conveyancemakeSubject = new BehaviorSubject<string>('');
  private conveyanceModalSubject = new BehaviorSubject<string>('');
  private conveyanceYearSubject = new BehaviorSubject<string>('');
  private conveyancemakeRegNoSubject = new BehaviorSubject<string>('');

  // Observables to subscribe in other components
  selectedConveyance$ = this.selectedConveyanceSubject.asObservable();
  selectedConveyanceType$ = this.selectedConveyanceTypeSubject.asObservable();
  conveyancemake$ = this.conveyancemakeSubject.asObservable();
  conveyanceModal$ = this.conveyanceModalSubject.asObservable();
  conveyanceYear$ = this.conveyanceYearSubject.asObservable();
  conveyancemakeRegNo$ = this.conveyancemakeRegNoSubject.asObservable();


  private socialMediaTypeIdSubject = new BehaviorSubject<string>('');
  private socialMediaIdSubject = new BehaviorSubject<string>('');

  // Observables to subscribe in other components
  socialMediaTypeId$ = this.socialMediaTypeIdSubject.asObservable();
  socialMediaId$ = this.socialMediaIdSubject.asObservable();

  private insuranceTypeSubject = new BehaviorSubject<string>('');
  private insuranceCompanySubject = new BehaviorSubject<string>('');
  private policyNumberSubject = new BehaviorSubject<string>('');
  private policyExpiryDateSubject = new BehaviorSubject<string>('');

  insuranceType$ = this.insuranceTypeSubject.asObservable();
  insuranceCompany$ = this.insuranceCompanySubject.asObservable();
  policyNumber$ = this.policyNumberSubject.asObservable();
  policyExpiryDate$ = this.policyExpiryDateSubject.asObservable();

  private AssetDescriptionSubject = new BehaviorSubject<string>('');

  AssetDescription$ = this.AssetDescriptionSubject.asObservable();


  private firstNameErrorSubject = new BehaviorSubject<string>('');
  private lastNameErrorSubject = new BehaviorSubject<string>('');
  private dateOfBirthErrorSubject = new BehaviorSubject<string>('');

  // Observable expose karna taake components subscribe kar sakein
  firstName$ = this.firstNameErrorSubject.asObservable();
  lastName$ = this.lastNameErrorSubject.asObservable();
  dateOfBirth$ = this.dateOfBirthErrorSubject.asObservable();

  private selectedBloodGroupSubject = new BehaviorSubject<{ Id: string, Name: string }>({ Id: '', Name: '' });
  private otherIncomeSubject = new BehaviorSubject<{ Id: boolean, Name: string }>({ Id: null, Name: '' });
  private DisabilitySelectSubject = new BehaviorSubject<{ Id: boolean, Name: string }>({ Id: null, Name: '' });
  private OtherSourceofIncomeDetailSubject = new BehaviorSubject<string>('');
  private DisabilityDetailSubject = new BehaviorSubject<string>('');



  selectedBloodGroup$ = this.selectedBloodGroupSubject.asObservable();
  otherIncome$ = this.otherIncomeSubject.asObservable();
  DisabilitySelect$ = this.DisabilitySelectSubject.asObservable();
  OtherSourceofIncomeDetail$ = this.OtherSourceofIncomeDetailSubject.asObservable();
  DisabilityDetail$ = this.DisabilityDetailSubject.asObservable();


  private txtAddressSubject = new BehaviorSubject<string>('');
  private txtTelMobileSubject = new BehaviorSubject<string>('');


  txtAddress$ = this.txtAddressSubject.asObservable();
  txtTelMobile$ = this.txtTelMobileSubject.asObservable();



  private formSubmittedSource = new BehaviorSubject<boolean>(false);
  formSubmitted$ = this.formSubmittedSource.asObservable();

  
  private hideButtonSubject = new Subject<string>();
  hideButton$ = this.hideButtonSubject.asObservable();

  hideButton(buttonId: string) {
    this.hideButtonSubject.next(buttonId);
  }


  //someOtherFunction(item: any, approvalStatus: string, onUpdateNextOfKin_Click: Function, forSelectedRowColor5: Function): void {
  //  if (approvalStatus !== 'S') {
  //    onUpdateNextOfKin_Click(item);
  //    forSelectedRowColor5();
  //  }
  //}

  // Functions to update the values
  setAccountTitle(accountTitle: string) {
    this.accountTitleSubject.next(accountTitle);
  }

  setAccountNo(accountNo: string) {
    this.accountNoSubject.next(accountNo);
  }

  setBankName(bankName: number) {
    this.bankNameSubject.next(bankName);
  }

  // Function to update the father info
  setFatherInfo(fatherFullName: string, fatherIDCardNo: string, fatherOccupation: string, fatherPhoneNo: string) {
    this.fatherFullNameSubject.next(fatherFullName);
    this.fatherIDCardNoSubject.next(fatherIDCardNo);
    this.fatherOccupationSubject.next(fatherOccupation);
    this.fatherPhoneNoSubject.next(fatherPhoneNo);
  }

  setEmergencyContactInfo(EmergencyFullName: string, EmergencyPhoneNoCell: string) {
    this.emergencyFullNameSubject.next(EmergencyFullName);
    this.emergencyPhoneNoSubject.next(EmergencyPhoneNoCell);

  }

  setNextOfKinInfo(NextOfKinName: string, NextOfKinPhonecell: string, Relationship1: { Id: string, Name: string }) {
    this.nextOfKinNameSubject.next(NextOfKinName);
    this.nextOfKinPhoneSubject.next(NextOfKinPhonecell);
    this.nextofKinRelationship.next(Relationship1);
  }

  setDependentInfo(firstName: string, lastName: string, selectedGender1: { Id: string, Name: string }, idCardNo: string, Relationship2: { Id: string, Name: string }) {
    this.depenFirstNameSubject.next(firstName);
    this.depenLastNameSubject.next(lastName);
    this.depenGenderSubject.next(selectedGender1);
    this.depenIdCardNoSubject.next(idCardNo);
    this.relationship2Subject.next(Relationship2);
  }

  setConveyanceInfo(
    selectedConveyance: { Id: boolean, Name: string },
    selectedConveyanceType: { Id: string, Name: string },
    conveyancemake: string,
    conveyanceModal: string,
    conveyanceYear: string,
    conveyancemakeRegNo: string
  ) {
    this.selectedConveyanceSubject.next(selectedConveyance);
    this.selectedConveyanceTypeSubject.next(selectedConveyanceType);
    this.conveyancemakeSubject.next(conveyancemake);
    this.conveyanceModalSubject.next(conveyanceModal);
    this.conveyanceYearSubject.next(conveyanceYear);
    this.conveyancemakeRegNoSubject.next(conveyancemakeRegNo);
  }

  setSocialMediaInfo(typeId: string, id: string) {
    this.socialMediaTypeIdSubject.next(typeId);
    this.socialMediaIdSubject.next(id);
  }

  setInsuranceDetails(InsuranceType: string, InsuranceCompany: string, PolicyNumber: string, txtpolicyExpiryDate: string) {
    this.insuranceTypeSubject.next(InsuranceType);
    this.insuranceCompanySubject.next(InsuranceCompany);
    this.policyNumberSubject.next(PolicyNumber);
    this.policyExpiryDateSubject.next(txtpolicyExpiryDate);
  }
  setFinancialLiabilities(AssetsDescription: string) {
    this.AssetDescriptionSubject.next(AssetsDescription);

  }
  setBasicInfo1(txtFirstrName: string, txtLastName: string, txtDateOB: string) {
    this.firstNameErrorSubject.next(txtFirstrName);
    this.lastNameErrorSubject.next(txtLastName);
    this.dateOfBirthErrorSubject.next(txtDateOB);
  }
  setBasicInfo2(selectedBloodGroup: { Id: string, Name: string }, otherIncome: { Id: boolean, Name: string }, DisabilitySelect: { Id: boolean, Name: string }, OtherSourceofIncomeDetail: string, DisabilityDetail: string) {
    this.selectedBloodGroupSubject.next(selectedBloodGroup);
    this.otherIncomeSubject.next(otherIncome);
    this.DisabilitySelectSubject.next(DisabilitySelect);
    this.OtherSourceofIncomeDetailSubject.next(OtherSourceofIncomeDetail);
    this.DisabilityDetailSubject.next(DisabilityDetail);
  }
  setContactInfo(txtAddress: string, txtTelMobile: string) {
    this.txtAddressSubject.next(txtAddress);
    this.txtTelMobileSubject.next(txtTelMobile);
  }

  setFormSubmitted(submitted: boolean) {
    this.formSubmittedSource.next(submitted);
  }
}
