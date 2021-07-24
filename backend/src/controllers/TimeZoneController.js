import codes from "../constants/codes";
import defaultResponse from "../constants/defaultResponse";


export default {

    async getAll(req, res) {
        let response = {
            ...defaultResponse,
        };
        try {
            setResponseTimeout(res);
            const { email, password } = req.body;

            let user = null;

            user = await Time.login(email, password);


            if (!user)
                throw new AuthenticationError()

            response.code = codes.SUCESS;
            response.data = ;
            res.status(response.status).send(response);
        }
        catch (err) {
            defaultErrorHandler(err, response, req, res);
        }
    },

}