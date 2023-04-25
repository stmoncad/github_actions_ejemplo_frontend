import { User } from "src/app/security/models/User";
import { ProfileData } from '../repositories/ProfileData';

export class Profile extends User {    
    private _firstName:string;
    private _lastName:string;

    constructor(profileData:ProfileData) {
        super(profileData);
        this._firstName = profileData.firstName || "";
        this._lastName = profileData.lastName || "";
    }

    get firstName():string {
        return this._firstName;
    }

    get lastName():string {
        return this._lastName;
    }

    override get isValid():boolean {
        return this.userName.length > 5 
            && this.securityToken.length > 0;
    }
}
