//make the best javascript error handler for nodejs 
export const errorHandler = async (req, res, next) => {
    try {
        next();
    } catch (error) {
        console.log(error);
        res.status(error.httpStatusCode || 500
        ).send({ message: error.message });
    }
};

export const notFound = async (req, res, next) => {
    try {
        res.status(404).send({ message: "Not Found" });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const badRequest = async (req, res, next) => {
    try {
        res.status(400).send({ message: "Bad Request" });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const forbidden = async (req, res, next) => {
    try {
        res.status(403).send({ message: "Forbidden" });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const unauthorized = async (req, res, next) => {
    try {
        res.status(401).send({ message: "Unauthorized" });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const catchAllHandler = async (err, req, res, next) => {
    try {
        console.log(err);
        res.status(err.httpStatusCode || 500).send({ message: err.message });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

