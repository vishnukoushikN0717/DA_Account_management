export interface AssociatedEntity {
    id: string;
    entityType: string;
    name: string;
  }
  
  export interface Practitioner {
    id: string;
    firstName: string;
    lastName: string;
    jobTitle: string;
    practitionerType: string;
    personaType: string;
    practitionerLifecycleStage: string;
    state: string;
    city: string;
    county: string;
    zipcode: string;
    streetAddress: string;
    mapLink: string;
    individualNpi: string;
    email: string;
    phoneNo: string;
    alternatePhone: string;
    website: string;
    faxNo: string;
    linkedInID: string;
    facebookID: string;
    instagramID: string;
    twitterID: string;
    doximityID: string;
    noOfPendingOrders: number;
    noOfTotalPatients: number;
    noOfPracticesAssociated: number;
    createdAt?: string;
    updatedAt?: string;
    associatedEntities?: AssociatedEntity[];
  }