import {
    bool,
    Canister,
    nat64,
    nat8,
    Opt,
    Principal,
    query,
    Record,
    StableBTreeMap,
    text,
    Vec
} from 'azle';
const Donation = Record({
    id: Principal,
    time: nat64,
    value: nat64
})

const Creator= Record({
    id: Principal,
    Category : text,
    donations: Vec(Donation)
})


let CreatorStore = StableBTreeMap(Principal,Creator,0);
let UserDonation = StableBTreeMap(Principal, Vec(Donation),1)

export {Creator,CreatorStore,Donation, UserDonation}

