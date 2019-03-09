"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
function onUserCreate(db) {
    return ({ uid }) => __awaiter(this, void 0, void 0, function* () {
        const userRecord = yield admin.auth().getUser(uid);
        const uUser = {
            displayName: userRecord.displayName || `${userRecord.uid}`,
            createdOn: new Date().getTime(),
        };
        try {
            yield db
                .collection('users')
                .doc(userRecord.uid)
                .set(uUser);
            return true;
        }
        catch (error) {
            console.error('Failed to add user to database');
            return false;
        }
    });
}
exports.onUserCreate = onUserCreate;
function onUserDelete(db) {
    return (userRecord) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield db
                .collection('users')
                .doc(userRecord.uid)
                .delete();
            return true;
        }
        catch (error) {
            console.error('Failed to delete user from database');
            return false;
        }
    });
}
exports.onUserDelete = onUserDelete;
//# sourceMappingURL=user_apis.js.map