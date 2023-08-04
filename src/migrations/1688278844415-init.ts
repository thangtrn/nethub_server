import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1688278844415 implements MigrationInterface {
    name = 'Init1688278844415'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "role" ("id" int NOT NULL IDENTITY(1,1), "role" varchar(255) NOT NULL, "desc" nvarchar(255), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_3c39bd046f5e69d37f0e4fe7688" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_824e186a844b0ca85bb8e6a14e5" DEFAULT getdate(), CONSTRAINT "UQ_367aad98203bd8afaed0d704093" UNIQUE ("role"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post_media" ("cloudinaryId" varchar(255) NOT NULL, "postId" bigint NOT NULL, "type" varchar(20) NOT NULL CONSTRAINT "DF_6f8585eb3676ec420561ddd41ee" DEFAULT 'Image', "mediaUrl" varchar(255), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_57ddd3fc3584d7bd0f78e08f657" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_8f9e5b23cc47aac6113765af349" DEFAULT getdate(), CONSTRAINT "PK_47630106851794a71d0e84aeb5e" PRIMARY KEY ("cloudinaryId"))`);
        await queryRunner.query(`CREATE TABLE "post" ("id" bigint NOT NULL IDENTITY(1,1), "isGlobal" bit NOT NULL CONSTRAINT "DF_fdecbd44de3ac5f26e47c4cdbb1" DEFAULT 1, "content" nvarchar(max) NOT NULL, "userId" bigint NOT NULL, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_fb91bea2d37140a877b775e6b2a" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_c067eb835d38353bdf4cdaf3705" DEFAULT getdate(), CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "like" ("userId" bigint NOT NULL, "postId" bigint NOT NULL, CONSTRAINT "PK_78a9f4a1b09b6d2bf7ed85f252f" PRIMARY KEY ("userId", "postId"))`);
        await queryRunner.query(`CREATE TABLE "refresh_token" ("id" int NOT NULL IDENTITY(1,1), "token" nvarchar(255) NOT NULL, "userId" bigint NOT NULL, CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "follower" ("userId" bigint NOT NULL, "followerId" bigint NOT NULL, CONSTRAINT "PK_f9eff94dafc548b195edbd31eb5" PRIMARY KEY ("userId", "followerId"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" bigint NOT NULL IDENTITY(1,1), "email" nvarchar(100) NOT NULL, "password" nvarchar(100) NOT NULL, "name" nvarchar(100) NOT NULL, "birthday" datetime NOT NULL, "gender" nvarchar(20) NOT NULL, "avatar" nvarchar(255) NOT NULL CONSTRAINT "DF_b613f025993be2d1e51ba4c2b5f" DEFAULT 'https://res.cloudinary.com/thangtrn01/image/upload/v1687944965/social_network/default_avatar_ctknzr.png', "roleId" int NOT NULL, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_e11e649824a45d8ed01d597fd93" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_80ca6e6ef65fb9ef34ea8c90f42" DEFAULT getdate(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" bigint NOT NULL IDENTITY(1,1), "parentId" bigint, "userId" bigint NOT NULL, "postId" bigint NOT NULL, "type" nvarchar(20) NOT NULL CONSTRAINT "DF_851521429d0d0c20ffd3fcaff26" DEFAULT 'Non', "content" nvarchar(max) NOT NULL, "cloudinaryId" varchar(255), "mediaUrl" nvarchar(255), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_3edd3cdb7232a3e9220607eabba" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_ac0081ff2cbd7d3bc5b0fab55c7" DEFAULT getdate(), CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "post_media" ADD CONSTRAINT "FK_4adcc5190e3b5c7e9001adef3b8" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "FK_e8fb739f08d47955a39850fac23" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "FK_3acf7c55c319c4000e8056c1279" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follower" ADD CONSTRAINT "FK_6fe328c3c08b70a5c9c79348839" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follower" ADD CONSTRAINT "FK_b100536f62259b7aa3733175e53" FOREIGN KEY ("followerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_e3aebe2bd1c53467a07109be596" FOREIGN KEY ("parentId") REFERENCES "comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_94a85bb16d24033a2afdd5df060" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_94a85bb16d24033a2afdd5df060"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_e3aebe2bd1c53467a07109be596"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`);
        await queryRunner.query(`ALTER TABLE "follower" DROP CONSTRAINT "FK_b100536f62259b7aa3733175e53"`);
        await queryRunner.query(`ALTER TABLE "follower" DROP CONSTRAINT "FK_6fe328c3c08b70a5c9c79348839"`);
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_8e913e288156c133999341156ad"`);
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "FK_3acf7c55c319c4000e8056c1279"`);
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "FK_e8fb739f08d47955a39850fac23"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_5c1cf55c308037b5aca1038a131"`);
        await queryRunner.query(`ALTER TABLE "post_media" DROP CONSTRAINT "FK_4adcc5190e3b5c7e9001adef3b8"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "follower"`);
        await queryRunner.query(`DROP TABLE "refresh_token"`);
        await queryRunner.query(`DROP TABLE "like"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TABLE "post_media"`);
        await queryRunner.query(`DROP TABLE "role"`);
    }

}
