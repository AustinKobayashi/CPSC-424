%
% CPSC 424 Assignment 5 Question 2
%
% In this question, you will compute curvature, normals, tangents, and arc
% length for three curves given as parametric symbolic functions ([x1, y1],
% etc.).
%
% You can use Matlab's symbolic differentiation tools to help you
% compute these quantities.  The relevant command is diff(). The
% sumbolic integration tool int() can also be helpful. Alternatively,
% you can manually hardcode the formulas.
%
% You may also need to use the command matlabFunction() to convert
% symbolic functions into numerical functions that can be evaluated.
%
% Finally, to visualize the computed quantities you should pass them
% into the draw_curve_helper() function. The template code below
% visualizes some dummy values; you should replace them with the
% requested values.

% t-values range from 0 to 2
t_vals = reshape(0:0.01:2, [], 1);

% place holders for tangent, normal, arclength, and curvature.
dummy_scalar_vals = t_vals;
dummy_vector_vals = ones( size(t_vals, 1), 2) * 0.1;

% Register t as a symbolic variable to allow symbolic differentiation
syms t

% ===================================================================
%                            Curve 1
% ===================================================================
x1 = t;
y1 = t.^2;

% Evaluate curve
x_func = matlabFunction(x1); % Convert from symbolic to numerical function
y_func = matlabFunction(y1);
x = x_func(t_vals); % Evaluate numerical function at each t-value
y = y_func(t_vals);

% Compute curvature, arclength, tangents and normals at each t-value here.

curvature = get_curvature (x_func, y_func, t_vals);
arclength = get_arclength (x_func, y_func, t_vals);
tangents = 0.5 * get_tangents (x_func, y_func, t_vals);
normals = 0.5 * get_normals (x_func, y_func, t_vals);

% Draw the curve
figure(1);
draw_curve_helper([x, y], ...
                  curvature, arclength, ...
                  tangents, normals);


% ===================================================================
%                            Curve 2
% ===================================================================

x2 = (t+1).^3;
y2 = (t-1).^3;

% Evaluate curve
x_func = matlabFunction(x2); % Convert from symbolic to numerical function
y_func = matlabFunction(y2);
x = x_func(t_vals); % Evaluate numerical function at each t-value
y = y_func(t_vals);


% Compute curvature, arclength, tangents and normals at each t-value here.

curvature = get_curvature (x_func, y_func, t_vals);
arclength = get_arclength (x_func, y_func, t_vals);
tangents = get_tangents (x_func, y_func, t_vals);
normals = 0.5 * get_normals (x_func, y_func, t_vals);

% Draw the curve
figure(2);
draw_curve_helper([x, y], ...
                  curvature, arclength, ...
                  tangents, normals);

              
% ===================================================================
%                            Curve 3
% ===================================================================

x3 = cos(t*pi);
y3 = sin(t*pi/3.);

% Evaluate curve
x_func = matlabFunction(x3); % Convert from symbolic to numerical function
y_func = matlabFunction(y3);
x = x_func(t_vals); % Evaluate numerical function at each t-value
y = y_func(t_vals);

% Compute curvature, arclength, tangents and normals at each t-value here.

curvature = get_curvature (x_func, y_func, t_vals);
arclength = get_arclength (x_func, y_func, t_vals);
tangents = 0.15 * get_tangents (x_func, y_func, t_vals);
normals = 0.15 * get_normals (x_func, y_func, t_vals);

% Draw the curve
figure(3);
draw_curve_helper([x, y], ...
                  curvature, arclength, ...
                  tangents, normals);

% ======================================================================
%                      HELPER FUNCTIONS
% ======================================================================
function draw_curve_helper(pos, curvature, arclength, tangent, normal)
% function draw_curve_helper(x, curvature, arclength, tangent, normal)
%
% Draws a curve sampled at n points.
%
% pos is a n x 2 matrix with the point locations on the curve
% curvature is a vector of length n specifying the curvature at each x
% arclength is a vector of length n specifying the arclength at each x
% tangent is a matrix of size n x 2 specifying the tangent at each x
% normal is a matrix of size n x 2 specifying the normal at each x

% Make sure dimensions match
assert(size(pos,2) == 2);
assert(size(tangent,2) == 2);
assert(size(normal,2) == 2);
assert(size(pos,1) == size(tangent,1));
assert(size(pos,1) == size(normal,1));
assert(size(pos,1) == length(curvature));
assert(size(pos,1) == length(arclength));

% Draw curvature
subplot(2,2,1);
title('Curvature');
draw_curve_2D(pos, curvature);

% Draw arc-length
subplot(2,2,3);
title('Arc-length');
draw_curve_2D(pos, arclength);

% Draw normals
subplot(2,2,2);
title('Normals');
draw_curve_2D(pos, [], normal);

% Draw tangents
subplot(2,2,4);
title('Tangents');
draw_curve_2D(pos, [], tangent, 0.3); % minor disp

end



function curvature = get_curvature(x_func, y_func, t_vals)
    syms t
    numerator = diff(x_func, t) * diff(diff(y_func, t), t) - ...
                diff(y_func, t) * diff(diff(x_func, t), t);
    denominator = (diff(x_func, t)^2 + diff(y_func, t)^2)^1.5;
    curvature_vector = numerator / denominator;
    curvature_func = matlabFunction(curvature_vector);
    curvature = curvature_func(t_vals);
end



function arclength = get_arclength(x_func, y_func, t_vals)
    syms t
    curve_length = sqrt(diff(x_func, t)^2 + diff(y_func, t)^2);
    curve_length_func = matlabFunction(curve_length);
    
    % Using cumtrapz instead of direct integration since 
    % Integral of curve 2 did not exist
    arclength = cumtrapz(curve_length_func(t_vals));
end


function [unit_tangent_x, unit_tangent_y] = get_unit_tangents(x_func, y_func)
    syms t
    curve_length = sqrt(diff(x_func, t)^2 + diff(y_func, t)^2);
    unit_tangent_x = diff(x_func, t) / curve_length;
    unit_tangent_y = diff(y_func, t) / curve_length;
end


function tangents = get_tangents(x_func, y_func, t_vals)

    [unit_tangent_x, unit_tangent_y] = get_unit_tangents(x_func, y_func);
       
    tangent_func_x = matlabFunction(unit_tangent_x);
    tangent_func_y = matlabFunction(unit_tangent_y);
    tangents = [tangent_func_x(t_vals), tangent_func_y(t_vals)];
end


function normals = get_normals(x_func, y_func, t_vals)
    syms t
    [unit_tangent_x, unit_tangent_y] = get_unit_tangents(x_func, y_func);
    tangent_func_x = matlabFunction(unit_tangent_x);
    tangent_func_y = matlabFunction(unit_tangent_y);
    normals = [-tangent_func_y(t_vals), tangent_func_x(t_vals)];
end
