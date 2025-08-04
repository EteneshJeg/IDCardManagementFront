import { useEffect } from "react"
export default function Footer() {
	useEffect(() => {

    if (window.KTDrawer) {

      window.KTDrawer.createInstances();

    }

  }, []);
	return (
		
			<div id="kt_app_footer" className="app-footer">
							
							<div className="app-container container-fluid d-flex flex-column flex-md-row flex-center flex-md-stack py-3">
								
								<div className="text-dark order-2 order-md-1">
									<span className="text-muted fw-semibold me-1">2025&copy;</span>
									<a href="" target="_blank" className="text-gray-800 text-hover-primary">TechHive</a>
								</div>
								
								
								<ul className="menu menu-gray-600 menu-hover-primary fw-semibold order-1">
									<li className="menu-item">
										<a href="" target="_blank" className="menu-link px-2">2025&copy;</a>
									</li>
									<li className="menu-item">
										<a href="" target="_blank" className="menu-link px-2">TechHive</a>
									</li>
									
								</ul>
								
							</div>
						
						</div>
	
	)
}
