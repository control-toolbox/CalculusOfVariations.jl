var documenterSearchIndex = {"docs":
[{"location":"application-surface-revolution.html#catenoid","page":"Catenoid solution","title":"The surface of revolution of minimum area","text":"","category":"section"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"We consider the well-known surface of revolution of minimum area problem which dates back to Euler[1] [2].  We already know that the solution is a catenoid and we propose to retrieve this numerically and compute conjugate points, in relation with second order conditions of local optimality. This is a problem from calculus of variations but we consider  its optimal control version. We minimise the cost integral","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"    int_0^1 x(t)sqrt1+u^2(t)mathrmd t","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"under the dynamical constraint","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"    dotx(t) = u(t) quad u(t)inR","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"and the limit conditions","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"    x(0) = 1 quad x(1) = 25","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"To define this problem with OptimalControl.jl we have write:","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"using OptimalControl\n\nt0 = 0\ntf = 1\nx0 = 1\nxf = 2.5\n\nocp = @def begin\n\n    t ∈ [ t0, tf ], time\n    x ∈ R, state\n    u ∈ R, control\n\n    x(t0) == x0\n    x(tf) == xf\n\n    ẋ(t) ==  u(t)\n\n    ∫( x(t) * √(1 + u(t)^2) ) → min\n\nend\nnothing # hide","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"[1]: H. Schättler & U. Ledzewicz, Geometric optimal control: theory, methods and examples, vol~38 of Interdisciplinary applied mathematics, Springer Science & Business Media, New York (2012), xiv+640.","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"[2]: D. Liberzon, Calculus ov Variations and Optimal Control Theory, Princeton University Press (2012).","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"using Suppressor # to suppress warnings","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"The maximization of the pseudo-Hamiltonian provides the control with respect to  the state and the costate:","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"    u(xp) = mathrmsign(x) fracpsqrtx^2-p^2","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"From this control law, we could define the Hamiltonian  mathbfH(xp)=H(x p u(xp)) and its associated Hamiltonian flow. The OptimalControl.jl package does this for us simply passing to the function Flow, the optimal control problem with the control law.","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"using OrdinaryDiffEq\n\nu(x, p) = sign(x) * p / √(x^2-p^2)\n\nocp_flow = Flow(ocp, u; reltol=1e-10, abstol=1e-10)\nnothing # hide","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"Let us plot some extremals, solutions of this flow. The initial condition x_0 is fixed while we compute some extremals for different values of initial  covector p_0. We compute some specific initial covectors for a nice plot.","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"<article class=\"docstring\">\n<header>\n    <a class=\"docstring-article-toggle-button fa-solid fa-chevron-right\" href=\"javascript:;\" title=\"Expand docstring\"> </a>\n    <span class=\"docstring-category\">Computation of the initial covectors</span>\n</header>\n<section style=\"display: none;\">\n    <div>\n    <pre>\n    <code class=\"language-julia hljs\">using Roots\n\n# parameters\ntmax = 2\nxmax = 4\n\n# the extremal which has a conjugate time equal to 2: \np0_tau_2 = -0.6420147569351132\nxf_tau_2, _ = ocp_flow(t0, x0, p0_tau_2, tmax)\n\n#\nNp0x = 4\nΔx = xmax - xf_tau_2\nδx = Δx / (Np0x-1)\nδt = δx * (tmax - t0) / (xmax - 0) # depends on the xlims and ylims of the plots\n\n#\nxs_target = range(xf_tau_2, xmax, length=Np0x)\nts_target = collect(tmax:-δt:t0)\nNp0t = length(ts_target)\nNp0 = Np0x + Np0t\n\n#\ncondition(z,t,integrator) = z[1] - (xmax+1)\naffect!(integrator) = terminate!(integrator)\ncbt  = ContinuousCallback(condition,affect!)\n\n#\nπ((x, p)) = x\n\n# we seek the p0 which gives the xs_target at tf = 2\nF(p0) = (π ∘ ocp_flow)(t0, x0, p0, tmax, callback=cbt)\np0s = []\nfor i ∈ 1:Np0x\n    if i == 1\n        push!(p0s, p0_tau_2)\n    else\n        push!(p0s, Roots.find_zero(p0 -> F(p0) - xs_target[i], (p0_tau_2,  0.999)))\n    end\n    if i < Np0x\n        push!(p0s, Roots.find_zero(p0 -> F(p0) - (xs_target[i]+δx/2), (p0_tau_2, -0.999)))\n    end\nend\n\n# we seek the p0 which gives the ts_target at xf = xmax\nG(p0, ts_target) = (π ∘ ocp_flow)(t0, x0, p0, ts_target, callback=cbt) - xmax\nfor i ∈ 1:Np0t\n    push!(p0s, Roots.find_zero(p0 -> G(p0, ts_target[i]), (p0_tau_2,  0.999)))\n    try \n        push!(p0s, Roots.find_zero(p0 -> G(p0, ts_target[i] - (δt/2)), (p0_tau_2, -0.999)))\n    catch e \n        nothing\n    end\nend\n\nNp0 = length(p0s)</code><button class=\"copy-button fa-solid fa-copy\" aria-label=\"Copy this code ;opblock\" title=\"Copy\"></button></pre></div>\n</section>\n</article>","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"using Roots # hide\n\n# parameters # hide\ntmax = 2 # hide\nxmax = 4 # hide\n\n# the extremal which has a conjugate time equal to 2:  # hide\np0_tau_2 = -0.6420147569351132 # hide\nglobal xf_tau_2, _ = # hide\n@suppress_err begin # hide\nocp_flow(t0, x0, p0_tau_2, tmax) # hide\nxf_tau_2, _ = ocp_flow(t0, x0, p0_tau_2, tmax) # hide\nend # hide\n\n# # hide\nNp0x = 4 # hide\nΔx = xmax - xf_tau_2 # hide\nδx = Δx / (Np0x-1) # hide\nδt = δx * (tmax - t0) / (xmax - 0) # depends on the xlims and ylims of the plots # hide\n\n# # hide\nxs_target = range(xf_tau_2, xmax; length=Np0x) # hide\nts_target = collect(tmax:-δt:t0) # hide\nNp0t = length(ts_target) # hide\nNp0 = Np0x + Np0t # hide\n\n# # hide\ncondition(z,t,integrator) = z[1] - (xmax+1) # hide\naffect!(integrator) = terminate!(integrator) # hide\ncbt  = ContinuousCallback(condition,affect!) # hide\n\n# # hide\nπ((x, p)) = x # hide\n\n# we seek the p0 which gives the xs_target at tf = 2 # hide\nF(p0) = (π ∘ ocp_flow)(t0, x0, p0, tmax; callback=cbt) # hide\np0s = [] # hide\nfor i ∈ 1:Np0x # hide\n    if i == 1 # hide\n        push!(p0s, p0_tau_2) # hide\n    else # hide\n        @suppress_err begin # hide\n        push!(p0s, Roots.find_zero(p0 -> F(p0) - xs_target[i], (p0_tau_2,  0.999))) # hide\n        end # hide\n    end # hide\n    if i < Np0x # hide\n        @suppress_err begin # hide\n        push!(p0s, Roots.find_zero(p0 -> F(p0) - (xs_target[i]+δx/2), (p0_tau_2, -0.999))) # hide\n        end # hide\n    end # hide\nend # hide\n\n# we seek the p0 which gives the ts_target at xf = xmax # hide\nG(p0, ts_target) = (π ∘ ocp_flow)(t0, x0, p0, ts_target; callback=cbt) - xmax # hide\nfor i ∈ 1:Np0t # hide\n    @suppress_err begin # hide\n    push!(p0s, Roots.find_zero(p0 -> G(p0, ts_target[i]), (p0_tau_2,  0.999))) # hide\n    end # hide\n    try  # hide\n        @suppress_err begin # hide\n        push!(p0s, Roots.find_zero(p0 -> G(p0, ts_target[i] - (δt/2)), (p0_tau_2, -0.999))) # hide\n        end # hide\n    catch e  # hide\n        nothing # hide\n    end # hide\nend # hide\n\nNp0 = length(p0s) # hide\nnothing # hide","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"using Plots\n\nN = 200\ntf_ = 2\ntspan = range(t0, tf_, N)   # time interval\nplt_x = plot()              # plot of the state x(t)\nplt_p = plot()              # plot of the costate p(t)\nplt_u = plot()              # plot of the control u(t)\nplt_phase = plot()          # plot (x, p)\n\n# callback: termination\n# Without this, the numerical integration stop before tf for p₀ = 0.99\ncondition(z,t,integrator) = z[1] - (xmax+1)\naffect!(integrator) = terminate!(integrator)\ncbt  = ContinuousCallback(condition,affect!)\n\nfor p0 ∈ p0s # plot for each p₀ in p0s\n\n    flow_p0 = ocp_flow((t0, tf_), x0, p0; saveat=tspan, callback=cbt)\n\n    T = tspan\n    X = flow_p0.state.(T)\n    P = flow_p0.costate.(T)\n\n    plot!(plt_x, T, X;          color=:blue)\n    plot!(plt_p, T, P;          color=:blue)\n    plot!(plt_u, T, u.(X, P);   color=:blue)  \n    plot!(plt_phase, X, P;      color=:blue)\n\nend\n\n# Plots\nplot!(plt_x; xlabel=\"t\", ylabel=\"x(t,p₀)\", legend=false, ylims=(0, xmax))\nplot!(plt_p; xlabel=\"t\", ylabel=\"p(t,p₀)\", legend=false)\nplot!(plt_u; xlabel=\"t\", ylabel=\"u(t,p₀)\", legend=false, ylims=(-2.5, 5))\nplot!(plt_phase; xlabel=\"x(t,p₀)\", ylabel=\"p(t,p₀)\", legend=false, xlims=(0, 2), ylims=(-1, 2))\n\nplot(plt_x, plt_p, plt_u, plt_phase; layout=(2, 2), size=(800, 600))","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"Here, the shooting equation given by ","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"    S(p₀) = pi(z(t_fx_0p₀)) - x_f = 0","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"with pi(x p) = x, has two solutions: p₀ = -09851 and p₀ = 05126.","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"π((x, p)) = x\n\n# Shooting function\nS(p0) = (π ∘ ocp_flow)(t0, x0, p0, tf) - xf\n\n# Solve the shooting equation: first extremal\nglobal sol1_p0 = # hide\n@suppress_err begin # hide\nRoots.find_zero(S, (-0.99, -0.97)) # hide\nsol1_p0 = Roots.find_zero(S, (-0.99, -0.97))\nend # hide\n\n# Solve the shooting equation: second extremal\nglobal sol2_p0 = # hide\n@suppress_err begin # hide\nRoots.find_zero(S, (0.5, 0.6)) # hide\nsol2_p0 = Roots.find_zero(S, (0.5, 0.6))\nend # hide\n\n@suppress_err begin # hide\nprintln(\"sol1_p0 = \",  sol1_p0, \", S(sol1_p0) = \", S(sol1_p0))\nprintln(\"sol2_p0 =  \", sol2_p0, \", S(sol2_p0) = \", S(sol2_p0))\nend # hide","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"Let us plot the two solutions. One can notice that they intersect as shown by  the top-left subplot.","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"p0s = (sol1_p0, sol2_p0)     # the different p₀\n\nN = 100\ntspan = range(t0, tf, N)     # time interval\nplt2_x = plot()              # plot of the state x(t)\nplt2_p = plot()              # plot of the costate p(t)\nplt2_u = plot()              # plot of the control u(t)\nplt2_phase = plot()          # plot (x, p)\n\nlabels = [\"p₀=-0.9851\" , \"p₀=0.51265\"]\n\nfor (p0, label) ∈ zip(p0s, labels) # plot for each p₀ in p0s \n    \n    flow_p0 = ocp_flow((t0, tf), x0, p0; saveat=tspan)\n\n    T = tspan\n    X = flow_p0.state.(T)\n    P = flow_p0.costate.(T)\n    \n    plot!(plt2_x, T, X;         label=label)\n    plot!(plt2_p, T, P;         label=label)\n    plot!(plt2_u, T, u.(X, P);  label=label)  \n    plot!(plt2_phase, X, P;     label=label)\n\nend\n\nplot!(plt2_x, [tf], [xf]; xlabel=\"t\", ylabel=\"x(t,p₀)\", seriestype=:scatter,label=\"\")\nplot!(plt2_p; xlabel=\"t\", ylabel=\"p(t,p₀)\", legend=false, ylims=(-1.5, 5))\nplot!(plt2_u; xlabel=\"t\", ylabel=\"u(t,p₀)\", legend=false, ylims=(-6, 5))\nplot!(plt2_phase; xlabel=\"x(t,p₀)\", ylabel=\"p(t,p₀)\", legend=false, xlims=(0, 2.5), ylims=(-1, 5))\n\nplot(plt2_x, plt2_p, plt2_u, plt2_phase; layout=(2, 2), size=(800, 600))","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"Now, we can compute the conjugate points along the two extremals. We have to compute the flow delta z(t p₀) of the Jacobi equation  with the initial condition delta z(0) = (0 1). This is given solving","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"    delta z(t p₀) = dfracpartialpartial p₀z(t p₀)","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"Note that to compute the conjugate points, we only need the first component:","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"    delta z(t p₀)_1","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"using ForwardDiff\n\nfunction jacobi_flow(t, p0)\n    x(t, p0) = (π ∘ ocp_flow)(t0, x0, p0, t)\n    return ForwardDiff.derivative(p0 -> x(t, p0), p0)\nend\nnothing # hide","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"The first conjugate time is then the first time tau such that","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"    delta x(tau p₀)= delta z(tau p₀)_1 = 0","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"with p₀ fixed. On the following figure, one can see that the first extremal has  a conjugate time smaller than t_f=1 while for the second extremal, there is  no conjugate time. Thus, the first extremal cannot be optimal.","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"using Plots.PlotMeasures\n\nN = 100\n\n# Jacobi field for the first extremal\ntspan = range(t0, tf, N) # time interval\n\nδx = jacobi_flow.(tspan, sol1_p0)\n\nplt_conj1 = plot()\nplot!(plt_conj1, tspan, δx)  # as n=1, det(δx) = δx\nplot!(plt_conj1; xlabel=\"t\", ylabel=\"δx(t,p₀)\", legend=false, ylims=(-10, 10), size=(400, 300))\n\n# Jacobi field for the second extremal\ntspan = range(t0, 1.5, N) # time interval\n\nδx = jacobi_flow.(tspan, sol2_p0)\n\nplt_conj2= plot()\nplot!(plt_conj2, tspan, δx)  # as n=1 the det(δx) = δx\nplot!(plt_conj2; xlabel=\"t\", ylabel=\"δx(t,p₀)\", legend=false, ylims=(-10, 10), size=(400, 300))\n\n#\nplt_conj = plot(plt_conj1, plt_conj2; \n    layout=(1, 2), size=(800, 300), leftmargin=25px, bottommargin=15px)","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"We compute the first conjugate point along the first extremal and add it to the plot.","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"tau0 = Roots.find_zero(tau -> jacobi_flow(tau, sol1_p0), (0.4, 0.6))\n\nprintln(\"For p0 = \", sol1_p0, \" tau_0 = \", tau0)\n\nplot!(plt_conj[1], [tau0], [jacobi_flow(tau0, sol1_p0)]; seriestype=:scatter)","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"To conclude on this example, we compute the conjugate locus by using a path following algorithm. Define F(taup₀) = delta x(taup₀) and suppose that the partial  derivative partial_tau F(taup₀) is invertible, then, by the implicit function  theorem the conjugate time is a function of p₀. So, since here p₀inR, we can  compute them by solving the initial value problem for  p₀ in alpha beta:","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"    dottau(p₀) = -dfracpartial Fpartial tau(tau(p₀)p₀)^-1 \n    dfracpartial Fpartial p₀(tau(p₀)p₀) quad\n    tau(alpha) = tau_0","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"For the numerical experiment, we set alpha = -09995, beta = -05.","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"function conjugate_times_rhs_path(tau, p0)\n    dF = ForwardDiff.gradient(y -> jacobi_flow(y...), [tau, p0])\n    return -dF[2]/dF[1]\nend\n\nfunction conjugate_times(p0span, tau0)\n    ode = OrdinaryDiffEq.ODEProblem((tau, par, p0) -> conjugate_times_rhs_path(tau, p0), tau0, p0span)\n    sol = OrdinaryDiffEq.solve(ode; reltol=1e-8, abstol=1e-8)\n    return sol.u, sol.t # taus, p0s\nend\nnothing # hide","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"Now we have defined the algorithm, let us compute the conjugate locus and plot it.","category":"page"},{"location":"application-surface-revolution.html","page":"Catenoid solution","title":"Catenoid solution","text":"# conjugate locus\np0 = sol1_p0\ntaus1, p0s1 = conjugate_times((p0, -0.5), tau0)\ntaus2, p0s2 = conjugate_times((p0, -0.999), tau0)\ntaus = append!(taus2[end:-1:1],taus1)\np0s = append!(p0s2[end:-1:1],p0s1)\n\n# plot tau(p0)\nplt_conj_times = plot(p0s, taus; xlabel=\"p₀\", ylabel=\"τ\", color=:blue, xlims = (-1, -0.5))\n\n# get conjugate points\nX = []\nfor (tau, p0) ∈ zip(taus, p0s)\n    # compute x(tau, p0)\n    x = (π ∘ ocp_flow)(t0, x0, p0, tau)\n    push!(X, x)\nend\n\n# plot conjugate points on plt_x\nplot!(plt_x, taus, X; linewidth=3, color=:red, legend=false, xlims=(0, 2), ylims=(0, xmax))\n\n# \nplot(plt_x, plt_conj_times; \n    layout=(1,2), legend=false, size=(800,300), leftmargin=25px, bottommargin=15px)","category":"page"},{"location":"index.html#Calculus-of-variations","page":"Introduction","title":"Calculus of variations","text":"","category":"section"},{"location":"index.html#Introduction","page":"Introduction","title":"Introduction","text":"","category":"section"},{"location":"index.html","page":"Introduction","title":"Introduction","text":"Let consider mathcalI an open interval of mathbbR, Omega an open set of mathbbR^n and  a continuous application ","category":"page"},{"location":"index.html","page":"Introduction","title":"Introduction","text":"    beginarrayrcll\n        L colon  mathcalI times Omega times mathbbR^n  longrightarrow  mathbbR \n                   (t x u)  longmapsto      L(t x u)\n    endarray","category":"page"},{"location":"index.html","page":"Introduction","title":"Introduction","text":"We call such an application, a Lagrangian. Let a and b be two points of mathcalI such that a  b. Let x(cdot) in mathscrC^1(a b Omega), that is a continuous function on a b, valued in Omega, differentiable on (a b), whom derivative dotx(cdot) is continuous  on (a b) and can be continuously extended to a b. We define the cost associated to x as the functional","category":"page"},{"location":"index.html","page":"Introduction","title":"Introduction","text":"J(x) coloneqq int_a^b L(t x(t) dotx(t)) mathrmdt","category":"page"},{"location":"index.html","page":"Introduction","title":"Introduction","text":"Given two points A and B in Omega, we are interested in the optimisation problem","category":"page"},{"location":"index.html","page":"Introduction","title":"Introduction","text":"mathrmminimise  J(x)  x in mathscrC^1(a b Omega) x(a) = A x(b) = B","category":"page"},{"location":"index.html","page":"Introduction","title":"Introduction","text":"that we can write also","category":"page"},{"location":"index.html","page":"Introduction","title":"Introduction","text":"mathrminf_x in mathscrC^1(a b Omega) left J(x)  x(a) = A x(b) = B right","category":"page"},{"location":"index.html","page":"Introduction","title":"Introduction","text":"This variational problem is the most classical in calculus of variations. In this problem, the  initial and final times are fixed, as well as the extremities.","category":"page"},{"location":"index.html","page":"Introduction","title":"Introduction","text":"From the optimal control point of view, the control dynamics is trivial: dotx(t) = u(t),  with no constraints on the control, that is u(t) in mathbbR^n. This problem may be formulated as","category":"page"},{"location":"index.html","page":"Introduction","title":"Introduction","text":"left \n    beginarrayl\n        displaystyle min J(x u) coloneqq displaystyle\n        int_a^b L(t x(t) u(t))  mathrmdt 10em\n        dotx(t)  =  displaystyle u(t) quad  u(t) in R^n \n        quad t in a b\n        text ae 10em\n        x(a)=A quad x(b)=B\n    endarray\nright ","category":"page"},{"location":"index.html","page":"Introduction","title":"Introduction","text":"with a slight abuse of notations since from the optimal control point of view, the cost depends generally on the state x and the control u.","category":"page"},{"location":"index.html","page":"Introduction","title":"Introduction","text":"You may find an example of such a problem here.","category":"page"},{"location":"index.html#Dependencies","page":"Introduction","title":"Dependencies","text":"","category":"section"},{"location":"index.html","page":"Introduction","title":"Introduction","text":"All the numerical simulations to generate this documentation are performed with the following packages.","category":"page"},{"location":"index.html","page":"Introduction","title":"Introduction","text":"using Pkg\nPkg.status()","category":"page"}]
}
