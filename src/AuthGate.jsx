import React,{useEffect,useState} from 'react';

const css=`
.flow-auth{min-height:100dvh;display:grid;place-items:center;padding:24px 16px;background:#faf8fc;color:#292331;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
.flow-auth *{box-sizing:border-box}.flow-auth-card{width:100%;max-width:390px;background:#fff;border:1px solid #e9e1f1;border-radius:22px;padding:28px 24px;box-shadow:0 16px 48px #6550800d}
.flow-auth-mark{display:grid;place-items:center;width:46px;height:46px;border-radius:15px;background:#eee6f8;color:#8661b7;font-size:25px;margin-bottom:16px}
.flow-auth h1{font-size:25px;letter-spacing:-.6px;margin:0 0 8px}.flow-auth p{font-size:14px;line-height:1.6;color:#81758d;margin:0 0 20px}
.flow-auth-tabs{display:flex;padding:4px;background:#f4eff8;border-radius:11px;margin-bottom:20px;gap:4px}.flow-auth-tabs button{flex:1;border:0;border-radius:8px;padding:9px;background:transparent;color:#81758d;font-size:14px;cursor:pointer}.flow-auth-tabs button.active{background:#fff;color:#7650a8;font-weight:700;box-shadow:0 2px 8px #6550800d}
.flow-auth label{display:block;font-size:14px;font-weight:600;margin:0 0 14px}.flow-auth input{display:block;width:100%;margin-top:7px;border:1px solid #dfd5e9;border-radius:10px;padding:11px 12px;font-size:16px;background:#fff;color:#292331;min-height:44px}.flow-auth input:focus{outline:2px solid #bca0db;outline-offset:1px}
.flow-auth-submit{border:0;border-radius:10px;background:#8962bd;color:#fff;width:100%;padding:12px;font-size:15px;font-weight:700;cursor:pointer;min-height:44px}.flow-auth button:disabled{opacity:.55;cursor:wait}.flow-auth-link{display:block;margin:14px auto 0;border:0;background:transparent;color:#8661b7;padding:7px;font-size:14px;cursor:pointer}
.flow-auth .flow-auth-notice{margin:14px 0 0;padding:11px;border-radius:10px;background:#f5effa;color:#6f537f;white-space:pre-wrap;overflow-wrap:anywhere;font-size:14px}.flow-auth .flow-auth-foot{font-size:13px;margin:20px 0 0;text-align:center;color:#998da5}
@media(max-width:420px){.flow-auth-card{padding:24px 20px}}
`;

export default function AuthGate({client,appName,description,children}){
 const [session,setSession]=useState(null),[checking,setChecking]=useState(true),[mode,setMode]=useState('login');
 const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[confirm,setConfirm]=useState(''),[notice,setNotice]=useState(''),[busy,setBusy]=useState(false),[recovery,setRecovery]=useState(false),[retry,setRetry]=useState(0);
 useEffect(()=>{
  if(!client){setChecking(false);return}
  let alive=true,authVersion=0;
  const {data:{subscription}}=client.auth.onAuthStateChange((event,next)=>{authVersion++;if(!alive)return;if(event==='PASSWORD_RECOVERY')setRecovery(true);setSession(next);setChecking(false)});
  const version=authVersion;
  client.auth.getSession().then(({data,error})=>{if(!alive||authVersion!==version)return;if(error)setNotice(error.message);setSession(data?.session||null);setChecking(false)}).catch(e=>{if(alive){setNotice(e.message);setChecking(false)}});
  return()=>{alive=false;subscription.unsubscribe()};
 },[client,retry]);
 async function submit(e){
  e.preventDefault();if(!client||busy)return;setNotice('');
  if((mode==='signup'||recovery)&&password!==confirm){setNotice('비밀번호 확인이 일치하지 않아.');return}
  setBusy(true);
  try{
   let result;
   if(recovery)result=await client.auth.updateUser({password});
   else if(mode==='reset')result=await client.auth.resetPasswordForEmail(email.trim(),{redirectTo:window.location.origin});
   else if(mode==='signup')result=await client.auth.signUp({email:email.trim(),password,options:{emailRedirectTo:window.location.origin}});
   else result=await client.auth.signInWithPassword({email:email.trim(),password});
   if(result.error)throw result.error;
   if(recovery){setRecovery(false);setPassword('');setConfirm('');setNotice('비밀번호를 변경했어.')}
   else if(mode==='reset')setNotice('비밀번호 재설정 메일을 보냈어. 받은 편지함을 확인해 줘.');
   else if(mode==='signup'&&!result.data.session)setNotice('가입 확인 메일을 보냈어. 이메일 인증 후 로그인해 줘.');
   if(result.data?.session)setSession(result.data.session);
  }catch(e){setNotice(e.message||'로그인에 실패했어. 다시 시도해 줘.')}finally{setBusy(false)}
 }
 function switchMode(next){setMode(next);setNotice('');setPassword('');setConfirm('')}
 if(session&&!recovery)return <React.Fragment key={session.user.id}>{children}</React.Fragment>;
 return <main className="flow-auth"><style>{css}</style><section className="flow-auth-card">
  <div className="flow-auth-mark" aria-hidden="true">✦</div><h1>{appName}</h1><p>{description}</p>
  {checking?<p role="status">로그인 상태 확인 중…</p>:!client?<><p role="alert">Supabase 연결 설정이 필요해. 환경변수를 등록한 후 다시 배포해 줘.</p></>:<>
   {!recovery&&<nav className="flow-auth-tabs" aria-label="계정 메뉴"><button type="button" disabled={busy} className={mode==='login'?'active':''} onClick={()=>switchMode('login')}>로그인</button><button type="button" disabled={busy} className={mode==='signup'?'active':''} onClick={()=>switchMode('signup')}>회원가입</button></nav>}
   {(mode==='reset'||recovery)&&<h2 style={{fontSize:18,margin:'0 0 16px'}}>{recovery?'새 비밀번호 설정':'비밀번호 찾기'}</h2>}
   <form onSubmit={submit}>
    {!recovery&&<label>이메일<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} disabled={busy} placeholder="name@example.com"/></label>}
    {(mode!=='reset'||recovery)&&<label>{recovery?'새 비밀번호':'비밀번호'}<input type="password" minLength={6} required autoComplete={mode==='signup'||recovery?'new-password':'current-password'} value={password} onChange={e=>setPassword(e.target.value)} disabled={busy} placeholder="6자 이상"/></label>}
    {(mode==='signup'||recovery)&&<label>비밀번호 확인<input type="password" minLength={6} required autoComplete="new-password" value={confirm} onChange={e=>setConfirm(e.target.value)} disabled={busy}/></label>}
    <button className="flow-auth-submit" type="submit" disabled={busy}>{busy?'처리 중…':recovery?'비밀번호 변경':mode==='signup'?'회원가입':mode==='reset'?'재설정 메일 보내기':'로그인'}</button>
   </form>
   {!recovery&&<button type="button" className="flow-auth-link" disabled={busy} onClick={()=>switchMode(mode==='reset'?'login':'reset')}>{mode==='reset'?'로그인으로 돌아가기':'비밀번호를 잊으셨나요?'}</button>}
  </>}
  {notice&&<p className="flow-auth-notice" role="status">{notice}</p>}
  {!checking&&client&&!session&&notice&&<button type="button" className="flow-auth-link" disabled={busy} onClick={()=>{setChecking(true);setRetry(n=>n+1)}}>로그인 상태 다시 확인</button>}
  <p className="flow-auth-foot">같은 이메일 계정으로 기기 간 기록을 이어가요.</p>
 </section></main>;
}
