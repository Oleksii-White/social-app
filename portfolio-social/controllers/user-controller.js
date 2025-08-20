const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { prisma } = require("../prisma/prisma-client");
const Jdenticon = require('jdenticon');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const UserController = {
    register: async (req, res) => {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: "Все поля обязательны" });
        }

        try {
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: "Пользователь уже существует" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const png = Jdenticon.toPng(name, 200);
            const avatarBase64 = `data:image/png;base64,${png.toString('base64')}`;
            let avatarUrl = avatarBase64;
            try {
                const uploadedAvatar = await cloudinary.uploader.upload(avatarBase64);
                avatarUrl = uploadedAvatar.secure_url;
            } catch (error) {
                console.error("Cloudinary upload failed, using base64 avatar", error);
            }

            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    avatarUrl,
                },
            });

            res.json(user);
        } catch (error) {
            console.error("Error in register:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Все поля обязательны" });
        }

        try {
            const user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                return res.status(400).json({ error: "Неверный логин или пароль" });
            }

            const valid = await bcrypt.compare(password, user.password);

            if (!valid) {
                return res.status(400).json({ error: "Неверный логин или пароль" });
            }

            const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);

            res.json({ token });
        } catch (error) {
            console.error("Error in login:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    getUserById: async (req, res) => {
        const { id } = req.params;
        const userId = req.user.userId;

        try {
            const user = await prisma.user.findUnique({
                where: { id },
                include: {
                    followers: true,
                    following: true
                }
            });

            if (!user) {
                return res.status(404).json({ error: "Пользователь не найден" });
            }

            const isFollowing = await prisma.follows.findFirst({
                where: {
                    AND: [
                        { followerId: userId },
                        { followingId: id }
                    ]
                }
            });

            res.json({ ...user, isFollowing: Boolean(isFollowing) });
        } catch (error) {
            res.status(500).json({ error: "Что-то пошло не так" });
        }
    },

    updateUser: async (req, res) => {
        const { id } = req.params;
        const { email, name, dateOfBirth, bio, location } = req.body;

        let fileUrl;

        if (id !== req.user.userId) {
            return res.status(403).json({ error: "Нет доступа" });
        }

        try {
            if (req.file) {
                const b64 = Buffer.from(req.file.buffer).toString('base64');
                const avatarBase64 = `data:${req.file.mimetype};base64,${b64}`;
                fileUrl = avatarBase64;
                try {
                    const uploadedFile = await cloudinary.uploader.upload(avatarBase64);
                    fileUrl = uploadedFile.secure_url;
                } catch (error) {
                    console.error("Cloudinary upload failed, using base64 avatar", error);
                }
            }

            if (email) {
                const existingUser = await prisma.user.findFirst({
                    where: { email: email },
                });

                if (existingUser && existingUser.id !== parseInt(id)) {
                    return res.status(400).json({ error: "Почта уже используется" });
                }
            }

            const user = await prisma.user.update({
                where: { id },
                data: {
                    email: email || undefined,
                    name: name || undefined,
                    avatarUrl: fileUrl || undefined,
                    dateOfBirth: dateOfBirth || undefined,
                    bio: bio || undefined,
                    location: location || undefined,
                },
            });
            res.json(user);
        } catch (error) {
            console.log('error', error)
            res.status(500).json({ error: "Что-то пошло не так" });
        }
    },

    current: async (req, res) => {
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.user.userId },
                include: {
                    followers: {
                        include: {
                            follower: true
                        }
                    },
                    following: {
                        include: {
                            following: true
                        }
                    }
                }
            });

            if (!user) {
                return res.status(400).json({ error: "Не удалось найти пользователя" });
            }

            return res.status(200).json(user)
        } catch (error) {
            console.log('err', error)
            res.status(500).json({ error: "Что-то пошло не так" });
        }
    }
};

module.exports = UserController;
