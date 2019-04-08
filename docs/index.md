# CS 184 Final Project Proposal: Real-time Cosmological N-Body Simulation
## Summary: 
We intend to create a 3D N-body particle simulator for simulating the formation of large-scale cosmological structures, e.g. galaxies. We intend to make the simulation real-time and viewable in the browser with Three.js, a 3D graphics library using WebGL. The emphasis will be on aesthetic value rather than physical accuracy. 
### Team Members:
Andy Campbell 26692398
Tanmay Ghai 26052650
Aakash Parikh 3031925742
### Problem Description
In lecture, one of the examples given for a particle systems model was a galaxy simulation. This model is very exciting, not only because of how beautiful it looks, but also because it relies on connecting many of the topics we learned in class: animation and simulating real-world phenomena like gravity, materials, and lighting. Our goal for this project is to develop an N-body galaxy simulation that given a set of parameters will model a gravity formation real time in a browser using WebGL. 
The main challenges is computational complexity; while N-body simulators are simple in principle, they quickly become prohibitively expensive with large numbers of particles. 
To combat the complexity, we will rely on many of the topics covered in the course, namely numerical integration over small timesteps, spatial partitioning data structures to only consider interactions between nearby particles, and GLSL shaders (via WebGL).
We will use an existing 3D graphics library for web (likely Three.js) to handle the basic infrastructure (e.g. camera movement and shaders).

## Goals and Deliverables
### Plan to Deliver:
A visually-pleasing simulation of a collection of particles coalescing into a spiral galaxy, viewable in the browser.
A high enough frame rate for smooth animation, thus “real-time”.
Control over camera position, play/pause, and complexity of simulation (number of particles).
Ability to simulate a large enough (large N) system 
### Hope to Deliver:
Simulation of more complex processes, like galaxy collisions. (M-galaxy N-particles model)
More interactive controls, such as setting initial conditions, material compositions of objects etc.
Ability for user to control visual appearance of galaxy (perhaps choice of shaders).

## Schedule
In this section you should organize and plan the tasks and subtasks that your team will execute. Since presentations are ~4 weeks from the due-date of the proposal, you should include a set of tasks for every week.
* 	Week 1 (to April 14)
    * Finalize choice of libraries to use and begin setup code (blank 3D canvas).
* 	Week 2 (to April 21)
    * Implement N-body simulation code.
* 	Week 3 (to April 28)
    * Make the code real-time with optimizations like spatial data structures.
* 	Week 4 (to May 5)
    * Work on visual appearance of simulation, experimenting with different shaders and backdrops.
    * Submit Milestone status report webpage and video by April 30.
* 	Week 5 (to May 12)
    * Implement our stretch goals like galaxy collisions or additional interactivity if time permits.
    * Prepare slides and demo for Final Presentation on May 10.
    * Submit Final Project Webpage and Video by May 14.

## Resources
Computing platform: N/A. We will be developing in WebGL JavaScript, which is cross-platform and runs on any modern web browser.
Three.JS: JavaScript library and API for 3D graphics in a web browser using WebGL for speed.
https://github.com/magwo/fullofstars : A toy N-body simulation in WebGL that we will likely reference for things like shaders and camera movement.
http://www.asterank.com/api : An open-source database and website that we will likely reference for generating initial particle distributions.
https://svs.gsfc.nasa.gov/11534 : A NASA supercomputer simulation of galaxy formation, collisions etc. Will be useful for guiding our approach to the reach goals.
http://www.physics.rutgers.edu/~sellwood/manual.pdf & http://www.physics.rutgers.edu/galaxy/ : A package developed at Rutgers involving source code for the creation of disk-like and ellipsoidal N-bpdy galaxy simulations, which could be useful for speed-up and efficiency of code.
http://beltoforion.de/article.php?a=barnes-hut-galaxy-simulator&hl=en&s=idExample#idExample : A N-body galaxy simulator based on Barnes-Hut Galaxy theory that will be useful in helping us achieve our reach goal of galaxy collisions. 
