# Kerr-orbits

Bounded photon orbits around a spinning Black Hole. Natural units are used G=M=C=1; spin of the black hole is then 0<=a<=1. Bound orbits turn out to have a fixed radius r. Note not all the values for the pairs of the parameters (r,a) are solutions.

The visualization of the orbit and the interesting surfaces of the black hole (ergospheres and event horizons) are done in Kerr-Schild (cartesian) coordinates. (drawing is poorly optimized...)

The equations of motion for the photon are integrated using a simple RK4 method, [rk4](https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods).

See e.g. [Kerr-metric](https://en.wikipedia.org/wiki/Kerr_metric)

![example](/orbit.gif)