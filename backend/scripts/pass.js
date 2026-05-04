import bcrypt from 'bcrypt';

const hash = async () => {
    const hashedPassword = await bcrypt.hash('alice@acadara.com', 10);
    return hashedPassword;
}

hash().then(console.log);