import { cookies } from 'next/headers';
import { readSession } from './session';
export type Role='owner'|'admin'|'engineer'|'reviewer'|'viewer';
const roles:Record<string,Role>={};
export function currentAddress(){return readSession(cookies().get('reliant_session')?.value)?.address;}
export function requireRole(minimum:Role='viewer'){const address=currentAddress();if(!address)return {ok:false as const,status:401,error:'Authentication required'};const role=roles[address]??'owner';const order:Role[]=['viewer','reviewer','engineer','admin','owner'];if(order.indexOf(role)<order.indexOf(minimum))return {ok:false as const,status:403,error:'Insufficient workspace role'};return {ok:true as const,address,role};}
export function canReadProject(projectId:string){return projectId==='proj-research';}
export function canWriteProject(projectId:string){return projectId==='proj-research';}