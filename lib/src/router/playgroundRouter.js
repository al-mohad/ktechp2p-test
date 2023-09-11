"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const playgroundController_1 = require("../controllers/playgroundController");
const index_1 = require("../index");
exports.default = (router) => {
    /**
     * @openapi
     * /playground:
     *   get:
     *     tags:
     *       - Playground
     *     summary: Check if the app is up
     *     responses:
     *       '200':
     *         description: The app is up and running
     *       '500':
     *         description: Internal server error
     */
    router.use('/playground', router);
    router.get('', playgroundController_1.playingPlayground);
    router.get('/repos/:username', playgroundController_1.getRepos);
    router.post('/setotp', playgroundController_1.sendOTP);
    router.post('/getotp', playgroundController_1.getotp);
    router.post('/sendsms', playgroundController_1.sendSMS);
    router.post('/upload-image', index_1.upload.single('testImage'), playgroundController_1.testUpload);
};
//# sourceMappingURL=playgroundRouter.js.map