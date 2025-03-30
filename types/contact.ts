export interface AssociatedEntity {
    id: string;
    entityType: string;
    name: string;
  }
  
  export interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    jobTitle: string;
    personaType: string;
    contactLifecycleStage: string;
    state: string;
    city: string;
    county: string;
    zipcode: string;
    streetAddress: string;
    mapLink: string;
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
    contactOwner: string;
    createdAt?: string;
    updatedAt?: string;
    associatedEntities?: AssociatedEntity[];
  }