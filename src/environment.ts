// export const jwtsecretKey = process.env.JWT_SECRET_KEY || process.exit(1);

export const jwtSecretKey = process.env.JWT_SECRET_KEY || (() => { 
    console.error("JWT_SECRET_KEY is not set! Exiting...");
    process.exit(1);
  })();
  export const databaseUrl = process.env.DATABASE_URL || (() => { 
    console.error("DATABASE_URL is not set! Exiting...");
    process.exit(1);
  })();
  export const directUrl = process.env.DIRECT_URL || (() => { 
    console.error("DIRECT_URL is not set! Exiting...");
    process.exit(1);
  })();