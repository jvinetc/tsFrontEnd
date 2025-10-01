export interface IStopResponse {
    id: string;
    address: {
        address: string;
        addressLineOne: string;
        addressLineTwo: string;
        latitude: number;
        longitude: number;
        placeId: string;
        placeTypes: [
            string
        ]
    };
    barcodes: [];
    driverIdentifier: string;
    allowedDriversIdentifiers: [
        string
    ];
    notes: string;
    packageCount: number;
    type: string;
    packageLabel: number;
    stopPosition: number;
    orderInfo: {
        products: [];
        sellerName: string;
        sellerOrderId: string;
        sellerWebsite: string;
    };
    placeInVehicle: number;
    recipient: {
        name: string;
        email: string;
        phone: string;
        externalId: number;
    };
    deliveryInfo: {
        attempted: boolean;
        attemptedAt: number;
        attemptedLocation: {
            latitude: number;
            longitude: number;
        };
        driverProvidedInternalNotes: string;
        driverProvidedRecipientNotes: string;
        photoUrls: [];
        succeeded: boolean;
        state: string;
    };
    proofOfAttemptRequirements: {
        enabled: null
    };
    plan: string;
    route: {
        id: string;
        title: string;
        stopCount: number;
        driver: string;
        state: {
            completed: boolean;
            completedAt: null;
            distributed: boolean;
            distributedAt: number;
            notifiedRecipients: boolean;
            notifiedRecipientsAt: number;
            started: boolean;
            startedAt: number;
        },
        plan: string;
    };
    customProperties: null,
    circuitClientId: null,
    activity: string
}

export interface IStopsResponse {
    stops: IStopResponse[]
    nextPageToken: string;
}
