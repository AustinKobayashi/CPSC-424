/**
 * Bezier is a set of functions that create bezier curve on canvas
 */

function Bezier () {

    this.control_points = [];

    this.curve_mode = "Basic";
    this.continuity_mode = "C0";
    this.subdivide_level = 0;
    this.piecewise_degree = 1;


    /** ---------------------------------------------------------------------
     * Evaluate the Bezier curve at the given t parameter
     * @param t Given t parameter
     * @return Vector2D The location of point at given t parameter
     */
    this.evaluate = function (t) {
        if (t >= 0.0 && t <= 1.000005) {
            if (this.control_points.length > 1) {

                // You may find the following functions useful"
                //  - this.binomialCoefficient(m, i) computes "m choose i", aka: (m over i)
                //  - Math.pow(t, i) computes t raised to the power i

                const m = this.control_points.length - 1;
                let i = 0;

                let bernsteins = this.control_points.map(() => {
                    let bernstein = this.binomialCoefficient(m, i) * Math.pow(t, i) * Math.pow((1 - t), m - i);
                    i++;
                    return bernstein;
                });

                let ft = this.control_points[0].multiply(bernsteins[0]);

                for (i = 1; i < bernsteins.length; i++) {
                    ft = ft.add(this.control_points[i].multiply(bernsteins[i]));
                }

                return ft;
            }
        }
    };


    this.subdivide_helper = function (points) {

        if (points.length === 2) {
            points.splice(1, 0, (points[0].add(points[1])).multiply(0.5));
            return points;
        }

        let new_points = [];

        for (let i = 0; i < points.length - 1; i++) {
            new_points.push((points[i].add(points[i+1])).multiply(0.5));
        }

        new_points = this.subdivide_helper(new_points);
        new_points.splice(0, 0, points[0]);
        new_points.push(points[points.length - 1]);
        return new_points;
    };


    /** ---------------------------------------------------------------------
     * Subdivide this Bezier curve into two curves
     * @param curve1 The first curve
     * @param curve2 The second curve
     */
    this.subdivide = function (curve1, curve2) {

        //@@@@@
        // YOUR CODE HERE
        //@@@@@
        let points = this.subdivide_helper(this.control_points.slice());
        for (let i = 0; i <= Math.floor(points.length / 2); i++) {
            curve1.addControlPoint(points[i]);
        }
        for (let i = Math.floor(points.length / 2); i < points.length; i++) {
            curve2.addControlPoint(points[i]);
        }
    };


    /** ---------------------------------------------------------------------
     * Draw this Bezier curve
     */
    this.drawCurve = function () {
        if (this.control_points.length >= 2) {

            if (this.curve_mode === "Basic") {
                // Basic Mode
                //
                // Create a Bezier curve from the entire set of control points,
                // and then simply draw it to the screen

                // Do this by evaluating the curve at some finite number of t-values,
                // and drawing line segments between those points.
                // You may use the this.drawLine() function to do the actual
                // drawing of line segments.

                //@@@@@
                // YOUR CODE HERE
                //@@@@@
                const step = 0.01;
                for (let i = step; i <= 1; i = Math.round((i + step) * 100) / 100) {
                    this.drawLine(this.evaluate(i - step), this.evaluate(i));
                }

            }
            else if (this.curve_mode === "Subdivision") {
                // Subdivision mode
                //
                // Create a Bezier curve from the entire set of points,
                // then subdivide it the number of times indicated by the
                // this.subdivide_level variable.
                // The control polygons of the subdivided curves will converge
                // to the actual bezier curve, so we only need to draw their
                // control polygons.

                //@@@@@
                // YOUR CODE HERE
                //@@@@@
                if (this.subdivide_level === 0) {
                    this.drawControlPolygon();
                } else {
                    let curve1 = new Bezier();
                    let curve2 = new Bezier();

                    curve1.setGL(this.gl_operation);
                    curve2.setGL(this.gl_operation);

                    curve1.setCurveMode("Subdivision");
                    curve2.setCurveMode("Subdivision");

                    curve1.setSubdivisionLevel(this.subdivide_level - 1);
                    curve2.setSubdivisionLevel(this.subdivide_level - 1);

                    this.subdivide(curve1, curve2);

                    curve1.drawCurve();
                    curve2.drawCurve();
                }
            }
            else if (this.curve_mode === "Piecewise") {
                if (this.continuity_mode === "C0")
                {
                    // C0 continuity
                    //
                    // Each piecewise curve should be C0 continuous with adjacent
                    // curves, meaning they should share an endpoint.

                    //@@@@@
                    // YOUR CODE HERE
                    //@@@@@
                    const step = 0.01;

                    if (this.piecewise_degree >= this.control_points.length - 1) {
                        for (let i = step; i <= 1; i = Math.round((i + step) * 100) / 100) {
                            this.drawLine(this.evaluate(i - step), this.evaluate(i));
                        }

                    } else {

                        let points = this.control_points.slice();
                        console.log(this.control_points);
                        let num_curves = Math.ceil((this.control_points.length - 1) / this.piecewise_degree);
                        let last = points.shift();

                        let curves = [];

                        for (let i = 0; i < num_curves; i++) {
                            curves.push(new Bezier());

                            curves[i].setGL(this.gl_operation);

                            curves[i].setCurveMode("Basic");

                            curves[i].addControlPoint(last);

                            for (let n = 0; n < this.piecewise_degree && points.length > 0; n++) {
                                last = points.shift();
                                curves[i].addControlPoint(last);
                            }
                        }

                        curves.map(curve => {
                            curve.drawCurve();
                        });
                    }
                }
                else if (this.continuity_mode === "C1")
                {
                    // C1 continuity
                    //
                    // Each piecewise curve should be C1 continuous with adjacent
                    // curves.  This means that not only must they share an endpoint,
                    // they must also have the same tangent at that endpoint.
                    // You will likely need to add additional control points to your
                    // Bezier curves in order to enforce the C1 property.
                    // These additional control points do not need to show up onscreen.

                    //@@@@@
                    // YOUR CODE HERE
                    //@@@@@

                    const step = 0.01;

                    if (this.piecewise_degree >= this.control_points.length - 1) {
                        for (let i = step; i <= 1; i = Math.round((i + step) * 100) / 100) {
                            this.drawLine(this.evaluate(i - step), this.evaluate(i));
                        }
                    } else if (this.control_points.length <= 3) {
                        let points = this.control_points.slice();
                        console.log(this.control_points);
                        let num_curves = Math.ceil((this.control_points.length - 1) / this.piecewise_degree);
                        let last = points.shift();

                        let curves = [];

                        for (let i = 0; i < num_curves; i++) {
                            curves.push(new Bezier());

                            curves[i].setGL(this.gl_operation);

                            curves[i].setCurveMode("Basic");

                            curves[i].addControlPoint(last);

                            for (let n = 0; n < this.piecewise_degree && points.length > 0; n++) {
                                last = points.shift();
                                curves[i].addControlPoint(last);
                            }
                        }

                        curves.map(curve => {
                            curve.drawCurve();
                        });
                    } else {

                    }
                }
            }
        }
    };


    /** ---------------------------------------------------------------------
     * Draw line segment between point p1 and p2
     */
    this.drawLine = function (p1, p2) {
        this.gl_operation.drawLine(p1, p2);
    };


    /** ---------------------------------------------------------------------
     * Draw control polygon
     */
    this.drawControlPolygon = function () {
        if (this.control_points.length >= 2) {
            for (var i = 0; i < this.control_points.length - 1; i++) {
                this.drawLine(this.control_points[i], this.control_points[i + 1]);
            }
        }
    };

    /** ---------------------------------------------------------------------
     * Draw control points
     */
    this.drawControlPoints = function () {
        this.gl_operation.drawPoints(this.control_points);
    };


    /** ---------------------------------------------------------------------
     * Drawing setup
     */
    this.drawSetup = function () {
        this.gl_operation.drawSetup();
    };


    /** ---------------------------------------------------------------------
     * Compute nCk ("n choose k")
     * WARNING:: Vulnerable to overflow when n is very large!
     */
    this.binomialCoefficient = function (n, k) {
        var result = -1;

        if (k >= 0 && n >= k) {
            result = 1;
            for (var i = 1; i <= k; i++) {
                result *= n - (k - i);
                result /= i;
            }
        }

        return result;
    };


    /** ---------------------------------------------------------------------
     * Setters
     */
    this.setGL = function (gl_operation) {
        this.gl_operation = gl_operation;
    };

    this.setCurveMode = function (curveMode) {
        this.curve_mode = curveMode;
    };

    this.setContinuityMode = function (continuityMode) {
        this.continuity_mode = continuityMode;
    };

    this.setSubdivisionLevel = function (subdivisionLevel) {
        this.subdivide_level = subdivisionLevel;
    };

    this.setPiecewiseDegree = function (piecewiseDegree) {
        this.piecewise_degree = piecewiseDegree;
    };


    /** ---------------------------------------------------------------------
     * Getters
     */
    this.getCurveMode = function () {
        return this.curve_mode;
    };

    this.getContinuityMode = function () {
        return this.continuity_mode;
    };

    this.getSubdivisionLevel = function () {
        return this.subdivide_level;
    };

    this.getPiecewiseDegree = function () {
        return this.piecewise_degree;
    };

    /** ---------------------------------------------------------------------
     * @return Array A list of control points
     */
    this.getControlPoints = function () {
        return this.control_points;
    };


    /** ---------------------------------------------------------------------
     * @return Vector2D chosen point
     */
    this.getControlPoint = function (idx) {
        return this.control_points[idx];
    };

    /** ---------------------------------------------------------------------
     * Add a new control point
     * @param new_point Vector2D A 2D vector that is added to control points
     */
    this.addControlPoint = function (new_point) {
        this.control_points.push(new_point);
    };

    /** ---------------------------------------------------------------------
     * Remove a control point
     * @param point Vector2D A 2D vector that is needed to be removed from control points
     */
    this.removeControlPoint = function (point) {
        var pos =  this.points.indexOf(point);
        this.control_points.splice(pos, 1);
    };

    /** ---------------------------------------------------------------------
     * Remove all control points
     */
    this.clearControlPoints = function() {
        this.control_points = [];
    };

    /** ---------------------------------------------------------------------
     * Print all control points
     */
    this.printControlPoints = function() {
        this.control_points.forEach(element => {
            element.printVector();
        });
    };
}
