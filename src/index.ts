import { Canister, Principal,query, text, update, Void,ic,Opt,nat64, Variant, Result, Err ,Ok, Vec} from 'azle';
import { Creator,CreatorStore , Donation,UserDonation} from './types';




const CreatorError= Variant({
    CreatorDoesNotExist: Principal,
    DonationDoesNotExist: Principal,
    UserNeverMadeDonations: Principal
})
export default Canister({
   //let's an individual register as a creator
   creatorSignUp: update([text], Creator,(category)=>{
    const id = generateId()
    const creator : typeof Creator = {
        id,
        Category: category,
        donations: []
    }
    CreatorStore.insert(ic.caller(), creator)
    return creator;

   }),
   DonateToCreator: update([nat64,Principal],Result(Creator,CreatorError),(amount,creatorId)=>{
    const id = generateId()
    const creatorOpt= CreatorStore.get(creatorId)

    if( 'None' in creatorOpt){
        return Err({
            CreatorDoesNotExist: creatorId
        })
    }
    const Creator= creatorOpt.Some

    const donate : typeof Donation = {
        id: id,
        time: ic.time(),
        value: amount
    }
    
    const creator  : typeof Creator = {
        ...Creator
    }
    creator.donations.push(donate)
    CreatorStore.insert(creatorId,creator);
    // UserDonation.insert(ic.caller(),donate)
    return Ok(creator);

   }),
   getCreatorById: query([Principal],Opt(Creator),(id)=>{
    return CreatorStore.get(id)
        
   }),
   //look at the donations made for any user
   UserDonationList: query([Principal],Result(Vec(Donation),CreatorError),(id)=>{
    const userOpt = UserDonation.get(id)
    if ('None' in userOpt){
        return Err({
            UserNeverMadeDonations: id
        })
    }
    const user = userOpt.Some
    return user;

   }),
   creatorAccessDonations: query([],Void,()=>{

   }),
   getid:query([],Principal, ()=>{
    return ic.caller()
   })
   
});



function generateId(): Principal {
    const randomBytes = new Array(29)
        .fill(0)
        .map((_) => Math.floor(Math.random() * 256));

    return Principal.fromUint8Array(Uint8Array.from(randomBytes));
}

