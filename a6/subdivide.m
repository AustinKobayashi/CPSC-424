function [xcoords, ycoords] = subdivide(xcoords, ycoords, niters, scheme, move2limit)
    % function [xcoords, ycoords] = subdivide(xcoords, ycoords, niters, scheme, move2limit)
    %
    % This function subdivides the given control polygon 'niters' times according to
    % the requested subdivision scheme.  Finally, each point is moved to the limit
    % curve using Eigen-analysis.
    %
    % xcoords and ycoords are the x- and y-coordinates of the control points.
    % niters is the number of subdivision iterations to perform.
    % scheme specifies the scheme to use:
    %   if scheme == 1, use the 1/8 1/8 3/4 (Cubic) subdivision scheme
    %   if scheme == 2, use the 1/7 1/7 5/7 subdivision scheme
    % move2limit specifies whether the points should be moved to their limit
    %            positions after subdivision.

    % YOUR IMPLEMENTATION GOES HERE
    
    if (niters > 0)

        len = length(xcoords);

        front_x = xcoords(1);
        back_x = xcoords(length(xcoords));
        front_y = ycoords(1);
        back_y = ycoords(length(ycoords));

        xcoords = [back_x xcoords front_x];
        ycoords = [back_y ycoords front_y];

        x_ret = [];
        y_ret = [];
        M = [1/2 1/2 0; 1/8 3/4 1/8; 0 1/2 1/2];

        if (scheme == 2)
            M = [1/2 1/2 0; 1/7 5/7 1/7; 0 1/2 1/2];
        end
        
        for i = 1:len
           x = M * transpose(xcoords(i:i+2));
           y = M * transpose(ycoords(i:i+2));
           x_ret = [x_ret transpose(x)];
           y_ret = [y_ret transpose(y)];
        end

        [xcoords, ycoords] = subdivide(x_ret, y_ret, niters - 1, scheme, move2limit);
    else
        if (move2limit == 1)
            [xcoords, ycoords] = movetolimit(xcoords, ycoords, scheme);
        end
    end
end


function [xcoords, ycoords] = movetolimit(xcoords, ycoords, scheme)
    M = [1/2 1/2 0; 1/8 3/4 1/8; 0 1/2 1/2];
    if (scheme == 2)
        M = [1/2 1/2 0; 1/7 5/7 1/7; 0 1/2 1/2];
    end
        
    [eig_vec, eig_val] = eig(M);
    
    len = length(xcoords);

    front_x = xcoords(1);
    back_x = xcoords(length(xcoords));
    front_y = ycoords(1);
    back_y = ycoords(length(ycoords));

    xcoords = [back_x xcoords front_x];
    ycoords = [back_y ycoords front_y];
        
    x_ret = [];
    y_ret = [];

    for i = 1:len
        x = inv(eig_vec) * transpose(xcoords(i:i+2));
        y = inv(eig_vec) * transpose(ycoords(i:i+2));
        x_ret = [x_ret x(1)];
        y_ret = [y_ret y(1)];
    end
    
    xcoords = x_ret;
    ycoords = y_ret;
end

