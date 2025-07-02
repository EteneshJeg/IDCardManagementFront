
import {signin} from "../features/userSlice"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getOrganizationInfo } from "../features/organizationSlice";


export default function Login(){
	const logged = useSelector((state) => state.user.logged);
	
const role = useSelector((state) => state.user.role);


const dispatch = useDispatch();
const navigate = useNavigate();
const [logo,setLogo]=useState();
	
	const {organizationInfo}=useSelector((state)=>state.organization);

	useEffect(()=>{
		dispatch(getOrganizationInfo()).then((data)=>{
			console.log(data);
			console.log(data.payload);
			console.log(data.payload[0]?.en_name)
			setLogo(data.payload[0]?.logo);
		})
	},[organizationInfo]);

const [formData, setFormData] = useState({
    email: '',
    password: ''
});

useEffect(() => {
	console.log(logged)
	console.log(role)
    if (logged ) {
        const lowerRole = String(role).toLowerCase();

        navigate("/dashboard");
    }
}, [logged, role, navigate]);

const handleSignin = (e) => {
    e.preventDefault();
    console.log(formData);
    dispatch(signin(formData));
	
};
    return(
        <div id="kt_body" className="app-blank app-blank h-screen ">
		{/*begin::Theme mode setup on page load*/}
		
		{/*end::Theme mode setup on page load*/}
		{/*begin::Root*/}
		<div className="d-flex flex-column flex-root h-screen" id="kt_app_root">
			{/*begin::Authentication - Sign-in */}
			<div className="d-flex flex-column flex-lg-row flex-column-fluid">
				{/*begin::Body*/}
				<div className="d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1">
					{/*begin::Form*/}
					<div className="d-flex flex-center flex-column flex-lg-row-fluid">
						{/*begin::Wrapper*/}
						<div className="w-lg-500px p-10">
							{/*begin::Form*/}
							<form className="form w-100" noValidate="novalidate" id="kt_sign_in_form" data-kt-redirect-url="../../demo1/dist/index.html" action="#">
								
								<div className="text-center mb-11">
									{/*begin::Title*/}
									<h1 className="text-dark fw-bolder mb-3">Sign In</h1>
									{/*end::Title*/}
									
								</div>
								
								
								
								{/*begin::Input group=*/}
								<div className="fv-row mb-8">
									{/*begin::Email*/}
									<input type="text" placeholder="Email" name="email" autoComplete="off" className="form-control bg-transparent" onChange={(e)=>setFormData({...formData,email:e.target.value})} />
									{/*end::Email*/}
								</div>
								{/*end::Input group=*/}
								<div className="fv-row mb-3">
									{/*begin::Password*/}
									<input type="password" placeholder="Password" name="password" autoComplete="off" className="form-control bg-transparent" onChange={(e)=>setFormData({...formData,password:e.target.value})}/>
									{/*end::Password*/}
								</div>
								{/*end::Input group=*/}
								{/*begin::Wrapper*/}
								<div className="d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8">
									<div></div>
									{/*begin::Link*/}
									<a href="../../demo1/dist/authentication/layouts/corporate/reset-password.html" className="link-primary">Forgot Password ?</a>
									{/*end::Link*/}
								</div>
								{/*end::Wrapper*/}
								{/*begin::Submit button*/}
								<div className="d-grid mb-10">
									<button type="submit" id="kt_sign_in_submit" className="btn btn-primary" onClick={handleSignin}>
										{/*begin::Indicator label*/}
										<span className="indicator-label" >Sign In</span>
										{/*end::Indicator label*/}
										{/*begin::Indicator progress*/}
										<span className="indicator-progress">Please wait...
										<span className="spinner-border spinner-border-sm align-middle ms-2"></span></span>
										{/*end::Indicator progress*/}
									</button>
								</div>
								{/*end::Submit button*/}
								
							</form>
							{/*end::Form*/}
						</div>
						{/*end::Wrapper*/}
					</div>
					{/*end::Form*/}
					
				</div>
				{/*end::Body*/}
				{/*begin::Aside*/}
				<div className="d-flex flex-lg-row-fluid w-lg-50 bgi-size-cover bgi-position-center order-1 order-lg-2" style={{backgroundColor: "blue"}}>
					{/*begin::Content*/}
					<div className="d-flex flex-column flex-center py-7 py-lg-15 px-5 px-md-15 w-100">
						{/*begin::Logo*/}
						<a href="/">
							{logo ? (
								<img src={logo} className="h-200px w-200px" style={{borderRadius:'50%'}}/>
							  ) : (
								<img alt="Logo"  className="h-30px"/>
							  )}
							</a>
						{/*end::Logo*/}
						{/*begin::Image*/}
						
						{/*end::Image*/}
						{/*begin::Title*/}
						<h1 className="d-none d-lg-block text-white fs-2qx fw-bolder text-center mb-7">TechHive Solutions</h1>
						{/*end::Title*/}
						{/*begin::Text*/}
						
						{/*end::Text*/}
					</div>
					{/*end::Content*/}
				</div>
				{/*end::Aside*/}
			</div>
			{/*end::Authentication - Sign-in*/}
		</div>
		{/*end::Root*/}
		{/*begin::Javascript*/}
		<script>var hostUrl = "assets/";</script>
		{/*begin::Global Javascript Bundle(mandatory for all pages)*/}
		<script src="assets/plugins/global/plugins.bundle.js"></script>
		<script src="assets/js/scripts.bundle.js"></script>
		{/*end::Global Javascript Bundle*/}
		{/*begin::Custom Javascript(used for this page only)*/}
		<script src="assets/js/custom/authentication/sign-in/general.js"></script>
		{/*end::Custom Javascript*/}
		{/*end::Javascript*/}
	</div>
    )
}
