export interface AssociatedEntity {
    id: string;
    entityType: string;
    name: string;
  }
  
  export interface Practice {
    // Base Entity Details
    id: string;
    name: string;
    loggedInUser: string;
    entityType: string;
    entitySubtype: string;
    lifecycleStage: string;
    entityNpiNumber: string;
  
    // Services
    clinicalServices: string;
    services: string;
    medicalSpeciality: string;
    insuranceAccepted: string[];
  
    // Location Details
    addressType: string;
    state: string;
    city: string;
    county: string;
    zipcode: number;
    streetAddress: string;
    mapLink: string;
  
    // Organization Structure
    divisionalGroup: string;
    division: string;
    subdivision: string;
    sector: string;
  
    // Contact Information
    email: string;
    phoneNo: string;
    alternatePhone: string;
    website: string;
    faxNo: string;
  
    // Social Media
    linkedInId: string;
    facebookId: string;
    instagramId: string;
    twitterId: string;
    doximityId: string;
  
    // Media
    logo: string;
    locationImage: string;
  
    // Metrics
    noOfPatients: number;
    noOfActivePatients: number;
    noOfActivePatientsHHAH: string;
    noOfLocations: number;
    noOfEmployees: number;
    noOfPhysicians?: number;
    yearlyRevenue: string;
  
    // Relationships
    parentCorporate: string;
    e_AssociatedEntitys: string[];
    associatedEntities?: AssociatedEntity[];
  }