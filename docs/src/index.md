# Calculus of variations

Let consider $\mathcal{I}$ an open interval of $\mathbb{R}$, $\Omega$ an open set of $\mathbb{R}^n$ and 
a continuous application 

```math
    \begin{array}{rcll}
        L \colon & \mathcal{I} \times \Omega \times \mathbb{R}^n & \longrightarrow & \mathbb{R} \\
                  & (t, x, u) & \longmapsto     & L(t, x, u).
    \end{array}
```

We call such an application, a *Lagrangian*. Let $a$ and $b$ be two points of $\mathcal{I}$ such that
$a < b$. Let $x(\cdot) \in \mathscr{C}^1([a, b], \Omega)$, that is a continuous function on $[a, b]$,
valued in $\Omega$, differentiable on $(a, b)$, whom derivative $\dot{x}(\cdot)$ is continuous 
on $(a, b)$ and can be continuously extended to $[a, b]$. We define the *cost* associated to $x$ as
the functional

```math
J(x) \coloneqq \int_a^b L(t, x(t), \dot{x}(t))\, \mathrm{d}t.
```

Given two points $A$ and $B$ in $\Omega$, we are interested in the optimisation problem

```math
\mathrm{minimise}~  J(x) ~:~ x \in \mathscr{C}^1([a, b], \Omega),~ x(a) = A,~ x(b) = B,
```

that we can write also

```math
\mathrm{inf}_{x \in \mathscr{C}^1([a, b], \Omega)} \left\{ J(x) ~|~ x(a) = A,~ x(b) = B \right\}.
```

This *variational problem* is the most classical in *calculus of variations*. In this problem, the 
initial and final times are fixed, as well as the extremities.

From the optimal control point of view, the control dynamics is trivial: $\dot{x}(t) = u(t)$, 
with no constraints on the control, that is $u(t) \in \mathbb{R}^n$. This problem may be formulated
as

```math
\left\{ 
    \begin{array}{l}
        \displaystyle \min\, J(x, u) \coloneqq \displaystyle
        \int_a^b L(t, x(t), u(t)) \, \mathrm{d}t \\[1.0em]
        \dot{x}(t)  =  \displaystyle u(t), \quad  u(t) \in \R^n, 
        \quad t \in [a, b]
        \text{ a.e.}, \\[1.0em]
        x(a)=A, \quad x(b)=B,
    \end{array}
\right. 
```

with a slight abuse of notations since from the optimal control point of view, the cost depends
generally on the state $x$ and the control $u$.

You may find an example of such a problem [here](@ref catenoid).