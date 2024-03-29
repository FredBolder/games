import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      validate: {
        validator: function(v) {
          return /^.+@(?:[\w-]+\.)+\w+$/.test(v);
        },
        message: props => `${props.value} is not a email address!`
      },
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    balLevels: {
      type: String,
    },
    balLastPlayed: {
      type: String,
    },
    balSettings: {
      type: String,
    },
    balSkipped: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
