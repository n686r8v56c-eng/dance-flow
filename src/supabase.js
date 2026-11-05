import {createClient} from '@supabase/supabase-js';
const url=import.meta.env.VITE_SUPABASE_URL;
const key=import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase=url&&key?createClient(url,key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}):null;
export async function getRemote(userId){if(!supabase)return null;const {data,error}=await supabase.from('dance_flow_data').select('payload,updated_at').eq('user_id',userId).maybeSingle();if(error)throw error;return data}
export async function saveRemote(userId,payload,expected){if(!supabase)return;
 const {data:row,error:readError}=await supabase.from('dance_flow_data').select('payload').eq('user_id',userId).maybeSingle();if(readError)throw readError;
 if(JSON.stringify(row?.payload??null)!==JSON.stringify(expected??null)){const error=Error('다른 기기의 수정이 감지되어 덮어쓰지 않았어.');error.code='DANCE_CONFLICT';throw error}
 const {error}=await supabase.from('dance_flow_data').upsert({user_id:userId,payload,updated_at:new Date().toISOString()},{onConflict:'user_id'});if(error)throw error;return payload
}
