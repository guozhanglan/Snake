var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var snake;
(function (snake) {
    var ValMap = (function () {
        function ValMap() {
            this.m_List = [];
            this.m_Map = {};
        }
        /** 更新key=val */
        ValMap.prototype.setVal = function (key, val) {
            var map = this.m_Map;
            if (key in map) {
                var old = map[key];
                var index = this.m_List.indexOf(old);
                if (index != -1) {
                    this.m_List[index] = val;
                }
                map[key] = val;
            }
        };
        ValMap.prototype.add = function (key, val) {
            if (key in this.m_Map) {
                this.setVal(key, val);
                return val;
            }
            else {
                this.m_List.push(val);
                this.m_Map[key] = val;
                return val;
            }
        };
        ValMap.prototype.remove = function (key) {
            if (key in this.m_Map) {
                var index = this.m_List.indexOf(this.m_Map[key]);
                this.m_Map[key] = null;
                delete this.m_Map[key];
                if (index != -1) {
                    this.m_List.splice(index, 1);
                }
                return true;
            }
            else {
                return false;
            }
        };
        ValMap.prototype.contains = function (key) {
            return key in this.m_Map;
        };
        ValMap.prototype.find = function (key) {
            var value = this.m_Map[key];
            if (value != undefined) {
                return value;
            }
            return null;
        };
        ValMap.prototype.clear = function () {
            this.m_List.length = 0;
            this.m_Map = {};
        };
        ValMap.prototype.size = function () {
            return this.m_List.length;
        };
        ValMap.prototype.list = function () {
            return this.m_List;
        };
        return ValMap;
    }());
    snake.ValMap = ValMap;
    __reflect(ValMap.prototype, "snake.ValMap");
    ;
})(snake || (snake = {}));
var snake;
(function (snake) {
    var DefaultFilter = (function () {
        function DefaultFilter() {
        }
        DefaultFilter.prototype.operator = function (item) {
            return true;
        };
        return DefaultFilter;
    }());
    snake.DefaultFilter = DefaultFilter;
    __reflect(DefaultFilter.prototype, "snake.DefaultFilter");
    ;
    var FixedSpatialItemContainer = (function () {
        function FixedSpatialItemContainer() {
            this.m_Min = new snake.Vector2();
            this.m_Max = new snake.Vector2();
            this.m_Bucket = [];
            this.m_CacheResult = [];
        }
        FixedSpatialItemContainer.prototype.GetBucketVec = function (p) {
            var to = new snake.Vector2();
            this.GetBucketIndex(p, to);
            return this.GetBucket(to.x, to.y);
        };
        FixedSpatialItemContainer.prototype.GetBucket = function (x, y) {
            var index = x + y * this.m_Width;
            var arr = this.m_Bucket[index];
            if (arr) {
                return arr;
            }
            arr = new Array();
            this.m_Bucket[index] = arr;
            return arr;
        };
        FixedSpatialItemContainer.prototype.GetBucketIndex = function (p, to) {
            var a1 = p.sub(this.m_Min);
            var a2 = this.m_Max.sub(this.m_Min);
            var n = a1.div(a2);
            to.x = snake.clamp(Math.ceil(n.x * this.m_Width), 0, this.m_Width - 1);
            to.y = snake.clamp(Math.ceil(n.y * this.m_Height), 0, this.m_Height - 1);
        };
        FixedSpatialItemContainer.prototype.Initialize = function (min, max, w, h) {
            this.m_Width = w;
            this.m_Height = h;
            this.m_Min = min;
            this.m_Max = max;
            this.m_Count = 0;
            this.Clear();
        };
        FixedSpatialItemContainer.prototype.Add = function (v) {
            var bucket = this.GetBucketVec(v.position);
            bucket.push(v);
            ++this.m_Count;
            return v;
        };
        FixedSpatialItemContainer.prototype.Remove = function (v) {
            var bucket = this.GetBucketVec(v.position);
            for (var i = 0; i < bucket.length; i++) {
                var confObj = bucket[i];
                if (confObj.id == v.id) {
                    bucket.splice(i, 1);
                    --this.m_Count;
                    break;
                }
            }
        };
        FixedSpatialItemContainer.prototype.FindInRange = function (p, r, dir, degree) {
            this.m_CacheResult.length = 0;
            var r2 = r * r;
            var x1 = 0, y1 = 0, x2 = 0, y2 = 0;
            var pv1 = new snake.Vector2();
            var pv2 = new snake.Vector2();
            this.GetBucketIndex(p.sub(r), pv1);
            x1 = pv1.x;
            y1 = pv1.y;
            this.GetBucketIndex(p.add(r), pv2);
            x2 = pv2.x;
            y2 = pv2.y;
            var pd = Math.cos(snake.deg2rad * degree * 0.5);
            for (var i = x1; i <= x2; ++i) {
                for (var j = y1; j <= y2; ++j) {
                    var list = this.GetBucket(i, j);
                    for (var it = 0; it < list.length; it++) {
                        var item = list[it];
                        var v = item.position.sub(p);
                        var vlen2 = v.SquareMagnitude();
                        if (vlen2 <= r2) {
                            var vdir = v.div(Math.sqrt(vlen2));
                            var p_1 = snake.Dot(vdir, dir);
                            if (p_1 >= pd) {
                                this.m_CacheResult.push(item); //it/item ?
                            }
                        }
                    }
                }
            }
            return this.m_CacheResult;
        };
        FixedSpatialItemContainer.prototype.FindInRangeFilter = function (min, max, filter) {
            this.m_CacheResult.length = 0;
            var x1 = 0, y1 = 0, x2 = 0, y2 = 0;
            var pv1 = new snake.Vector2();
            var pv2 = new snake.Vector2();
            this.GetBucketIndex(min, pv1);
            x1 = pv1.x;
            y1 = pv1.y;
            this.GetBucketIndex(max, pv2);
            x2 = pv2.x;
            y2 = pv2.y;
            for (var i = x1; i <= x2; ++i) {
                for (var j = y1; j <= y2; ++j) {
                    var list = this.GetBucket(i, j);
                    for (var it = 0; it < list.length; ++it) {
                        if (!filter.operator(it)) {
                            continue;
                        }
                        this.m_CacheResult.push(it);
                    }
                }
            }
            return this.m_CacheResult;
        };
        FixedSpatialItemContainer.prototype.ExtractInRange = function (min, max, outList) {
            outList.length = 0;
            var x1 = 0, y1 = 0, x2 = 0, y2 = 0;
            var pv1 = new snake.Vector2();
            var pv2 = new snake.Vector2();
            this.GetBucketIndex(min, pv1);
            x1 = pv1.x;
            y1 = pv1.y;
            this.GetBucketIndex(max, pv2);
            x2 = pv2.x;
            y2 = pv2.y;
            for (var i = x1; i <= x2; ++i) {
                for (var j = y1; j <= y2; ++j) {
                    var list = this.GetBucket(i, j);
                    this.m_Count -= list.length;
                    outList = outList.concat(list);
                }
            }
        };
        FixedSpatialItemContainer.prototype.Clear = function () {
            this.m_CacheResult.length = 0;
            this.m_Bucket.length = 0;
            this.m_Bucket.length = this.m_Width * this.m_Height;
            this.m_Count = 0;
        };
        FixedSpatialItemContainer.prototype.Count = function () {
            return this.m_Count;
        };
        FixedSpatialItemContainer.prototype.Buckets = function () {
            return this.m_Bucket;
        };
        return FixedSpatialItemContainer;
    }());
    snake.FixedSpatialItemContainer = FixedSpatialItemContainer;
    __reflect(FixedSpatialItemContainer.prototype, "snake.FixedSpatialItemContainer");
    ;
})(snake || (snake = {}));
var snake;
(function (snake) {
    var SceneManager = (function () {
        function SceneManager() {
            this.m_Scenes = new snake.ValMap();
            this.m_SceneIDCounter = 1;
        }
        SceneManager.prototype.CreateScene = function (params) {
            var id = this.m_SceneIDCounter++;
            var pScene = this.m_Scenes.add(id, new snake.Scene());
            if (pScene != null) {
                pScene.Initialize(params);
                return id;
            }
            return 0;
        };
        SceneManager.prototype.DeleteScene = function (sceneID) {
            this.m_Scenes.remove(sceneID);
        };
        SceneManager.prototype.GetScene = function (sceneID) {
            return this.m_Scenes.find(sceneID);
        };
        SceneManager.prototype.GetAICount = function () {
            var count = 0;
            var list = this.m_Scenes.list;
            var size = list.length;
            for (var it = 0; it < size; ++it) {
                count += list[it].GetAICount();
            }
            return count;
        };
        SceneManager.prototype.GetPlayerCount = function () {
            var count = 0;
            var list = this.m_Scenes.list;
            var size = list.length;
            for (var it = 0; it < size; ++it) {
                count += list[it].GetPlayerCount();
            }
            return count;
        };
        SceneManager.prototype.GetBeanCount = function () {
            var count = 0;
            var list = this.m_Scenes.list;
            var size = list.length;
            for (var it = 0; it < size; ++it) {
                count += list[it].GetBeanCount();
            }
            return count;
        };
        return SceneManager;
    }());
    snake.SceneManager = SceneManager;
    __reflect(SceneManager.prototype, "snake.SceneManager");
    ;
})(snake || (snake = {}));
var snake;
(function (snake) {
    var SlitherBase = (function () {
        function SlitherBase() {
            this.m_Direction = new snake.Vector2();
            this.m_TargetDirection = new snake.Vector2();
            this.m_AABB = new snake.AABB();
            this.m_Points = [];
            this.m_SlitherInfo = new snake.SlitherInfo();
            this.m_BodyInfo = [];
        }
        SlitherBase.prototype.CalculatePointCount = function () {
            return Math.ceil(this.m_SlitherInfo.length / this.SegmentLength());
        };
        SlitherBase.prototype.SegmentLength = function () {
            var params = this.m_pScene.Params();
            return snake.max(params.linearSpeedNormal * params.physicsTimeStep / params.frameStep, 0.01);
        };
        SlitherBase.prototype.UpdateBodyPointsFrame = function () {
            var params = this.m_pScene.Params();
            var m_Points = this.m_Points;
            for (var i = m_Points.length - 1; i >= 1; --i) {
                var pt = m_Points[i];
                var v = m_Points[i - 1].sub(pt);
                pt.addAssignment(v.mul(params.frameStep));
                m_Points[i] = pt;
            }
            this.m_PointsDirty = true;
        };
        SlitherBase.prototype.UpdateDevourBean = function (params, speedDir) {
            var devouredRaidus = this.m_SlitherInfo.width * 0.5 * params.devourScale + params.devourBase;
            var pos = this.m_Points[0];
            var beans = this.m_pScene.Beans();
            var devoured = beans.FindInRange(pos, devouredRaidus, speedDir, params.devourDegree);
            var scoreAdded = 0.0;
            var count = devoured.length;
            for (var i = 0; i < count; ++i) {
                var bean = devoured[i];
                if (bean.slitherID == 0) {
                    scoreAdded += bean.valReal;
                    this.m_pScene.DevourBean(bean, this.m_SlitherInfo.id, false);
                }
            }
            if (scoreAdded > 0.0) {
                this.AddScore(scoreAdded);
            }
        };
        SlitherBase.prototype.UpdateBounds = function () {
            var count = this.m_Points.length;
            this.m_AABB.Clear();
            for (var i = 0; i < count; ++i) {
                this.m_AABB.Encapuslate(this.m_Points[i]);
            }
            this.m_AABB.Enlarge(this.m_SlitherInfo.width * 0.5);
        };
        SlitherBase.prototype.UpdateEndPointIndex = function () {
            var accumDist = 0.0;
            var threshold = this.Width() * this.m_pScene.Params().headTestEndFactor;
            var count = this.m_Points.length;
            for (var i = count - 1; i > 0; --i) {
                accumDist += snake.Distance(this.m_Points[i - 1], this.m_Points[i]);
                if (accumDist > threshold) {
                    this.m_EndPointIndex = i;
                    break;
                }
            }
        };
        SlitherBase.prototype.OverlapBorder = function () {
            var params = this.m_pScene.Params();
            if (params.radius < 1e-2) {
                return false;
            }
            var center = this.m_Points[0];
            var v = snake.Distance(center, this.m_pScene.Center()) + this.m_SlitherInfo.width * (params.collisionThreshold - 0.5);
            if (v >= params.radius) {
                return true;
            }
            else {
                return false;
            }
        };
        SlitherBase.prototype.OverlapAnyOtherSlither = function (cc) {
            var center = this.m_Points[0];
            var slithers = this.m_pScene.AllSlithers();
            var count = slithers.length;
            for (var i = 0; i < count; ++i) {
                var pSlither = slithers[i];
                if (pSlither.ID() == this.m_SlitherInfo.id || cc.find(pSlither.ID()) != undefined) {
                    continue;
                }
                if (!pSlither.Bounds().IntersectVec(center, this.m_SlitherInfo.width * 0.5)) {
                    continue;
                }
                if (this.OverlapSlither(center, this.m_SlitherInfo.width, pSlither)) {
                    return pSlither;
                }
            }
            return null;
        };
        SlitherBase.prototype.OverlapSlither = function (center, width, other) {
            var params = this.m_pScene.Params();
            var r2 = (other.Width() + width) * 0.5 * params.collisionThreshold;
            r2 *= r2;
            var points = other.Points();
            var count = snake.min(other.PointCount(), other.EndPointIndex());
            for (var i = 0; i < count; ++i) {
                var dist2 = points[i].sub(center).SquareMagnitude();
                if (dist2 < r2) {
                    if (i < params.headTestStart) {
                        return width < other.Width();
                    }
                    else {
                        return true;
                    }
                }
            }
            return false;
        };
        SlitherBase.prototype.UpdateSpeed = function (dt, linearSpeed, speedDir, params) {
            if (this.m_TargetDirection.IsZero()) {
                this.m_TargetDirection = speedDir;
            }
            if (this.m_SlitherInfo.accelarating) {
                linearSpeed += dt * params.linearAccelartion;
            }
            else {
                linearSpeed -= dt * params.linearDeccelartion;
            }
            linearSpeed = snake.clamp(linearSpeed, params.linearSpeedNormal, params.linearSpeedFast);
            var k = (linearSpeed - params.linearSpeedNormal) / (params.linearSpeedFast - params.linearSpeedNormal);
            var width = this.Width();
            var rotationFactorNormal = this.m_pScene.WidthToRotateNormal(width);
            var rotationFactorFast = this.m_pScene.WidthToRotateFast(width);
            var rotationdFactor = snake.lerp(rotationFactorNormal, rotationFactorFast, k);
            var rotationSpeed = rotationdFactor / this.m_SlitherInfo.width;
            var newDir = snake.RotateTowards(speedDir, this.m_TargetDirection, rotationSpeed * dt);
            return newDir.mul(linearSpeed);
        };
        SlitherBase.prototype.Initialize = function (scene, id, skinID, score, headPos, dir) {
            var historyInfo = scene.GetHistorySlitherInfo(id);
            this.m_pScene = scene;
            this.m_EndPointIndex = 0;
            this.m_LastPhysicsTime = 0.0;
            this.m_LastScoreLostTime = 0.0;
            this.m_ScoreFactor = 1.0;
            this.m_Direction = dir;
            this.m_TargetDirection = dir;
            this.m_PointsDirty = true;
            this.m_HeadInfoDirty = true;
            this.m_StateInfoDirty = true;
            this.m_BodyInfoDirty = true;
            this.m_SlitherInfo.id = id;
            this.m_SlitherInfo.skinID = skinID;
            this.m_SlitherInfo.continueKillCount = 0;
            this.m_SlitherInfo.totalKillCount = historyInfo != null ? historyInfo.totalKillCount : 0;
            this.m_SlitherInfo.accelarating = false;
            this.m_SlitherInfo.score = score;
            this.m_SlitherInfo.speed = dir.mul(this.m_pScene.Params().linearSpeedNormal);
            this.m_SlitherInfo.width = this.m_pScene.ScroreToWidth(score);
            this.m_SlitherInfo.length = this.m_pScene.ScoreToLength(score);
            this.m_SlitherInfo.head = headPos;
            this.m_SlitherInfo.inTeamNum = 0;
            this.m_SlitherInfo.rank = 0;
            var count = this.CalculatePointCount();
            var points = this.m_Points;
            points.length = 0;
            points.push(headPos);
            this.m_AABB.Clear();
            this.m_AABB.Encapuslate(headPos);
            var segmentLength = this.SegmentLength();
            for (var i = 1; i < count; ++i) {
                var k = i < 3 ? segmentLength : 1e-3;
                var popV = points[points.length - 1];
                var p = popV.sub(dir.mul(k));
                this.m_Points.push(p);
                this.m_AABB.Encapuslate(p);
            }
            this.m_AABB.Enlarge(this.m_SlitherInfo.width * 0.5);
        };
        SlitherBase.prototype.Update = function (time, dt) {
            this.m_PointsDirty = false;
            var params = this.m_pScene.Params();
            if (this.m_SlitherInfo.accelarating) {
                var scoreLostPerSec = params.accelarateScoreRatio * params.accelarateScoreLost / params.accelarateScoreInterval;
                if (this.SubScore(scoreLostPerSec * dt)) {
                    this.m_SlitherInfo.accelarating = false;
                }
                else if (time - this.m_LastScoreLostTime > params.accelarateScoreInterval) {
                    this.m_pScene.GenerateBean(this.m_Points[this.m_Points.length - 1], params.accelarateScoreLost * params.scoreVisualScale, params.accelarateScoreLost);
                    this.m_LastScoreLostTime = time;
                }
            }
            if (this.m_LastPhysicsTime == 0.0) {
                this.m_LastPhysicsTime = time;
            }
            var linearSpeed = snake.max(this.m_SlitherInfo.speed.Magnitude(), 1e-3);
            this.m_Direction = this.m_SlitherInfo.speed.div(linearSpeed);
            this.m_SlitherInfo.speed = this.UpdateSpeed(dt, linearSpeed, this.m_Direction, params);
            var physicsDeltaTime = time - this.m_LastPhysicsTime;
            var physicsTimeStep = params.physicsTimeStep * params.linearSpeedNormal / this.m_SlitherInfo.speed.Magnitude();
            if (physicsDeltaTime > physicsTimeStep) {
                var k = physicsDeltaTime / physicsTimeStep;
                var n = Math.floor(k);
                for (var i = 0; i < n; ++i) {
                    this.UpdateBodyPointsFrame();
                    var speedV = this.m_SlitherInfo.speed.mul(physicsTimeStep);
                    this.m_Points[0].addAssignment(speedV);
                }
                this.m_LastPhysicsTime += n * physicsTimeStep;
            }
            this.m_SlitherInfo.head = this.m_Points[0];
            if (this.m_PointsDirty) {
                this.m_HeadInfoDirty = true;
                this.m_StateInfoDirty = true;
                this.m_BodyInfoDirty = true;
                this.UpdateDevourBean(params, this.m_Direction);
                this.UpdateBounds();
                this.UpdateEndPointIndex();
            }
        };
        SlitherBase.prototype.DrawGizmo = function (buffer, offset, maxSize) { return 0; };
        SlitherBase.prototype.UpdateCollision = function (cc) {
            if (!this.m_PointsDirty) {
                return;
            }
            if (this.OverlapBorder()) {
                cc.add(this.m_SlitherInfo.id, 0);
                this.m_SlitherInfo.lastKillerID = 0;
            }
            else {
                var pKiller = this.OverlapAnyOtherSlither(cc);
                if (pKiller != null) {
                    var killerInfo = pKiller.m_SlitherInfo;
                    killerInfo.continueKillCount++;
                    killerInfo.totalKillCount++;
                    this.m_SlitherInfo.lastKillerID = pKiller.ID();
                    cc.add(this.m_SlitherInfo.id, pKiller.ID());
                    this.m_pScene.GenerateBeanOnSlitherDie(this, pKiller);
                }
            }
        };
        SlitherBase.prototype.AddScore = function (score) {
            this.m_SlitherInfo.score += (score * this.m_ScoreFactor);
            this.m_SlitherInfo.width = this.m_pScene.ScroreToWidth(this.m_SlitherInfo.score);
            this.m_SlitherInfo.length = this.m_pScene.ScoreToLength(this.m_SlitherInfo.score);
            var count = this.CalculatePointCount();
            var points = this.m_Points;
            var tailPos = points[points.length - 1];
            var v = tailPos.sub(points[points.length - 2]);
            v.addAssignment(0.01);
            while (points.length < count) {
                tailPos.addAssignment(v);
                points.push(tailPos);
                this.m_PointsDirty = true;
            }
        };
        SlitherBase.prototype.SubScore = function (score) {
            var reachedBase = false;
            var baseScore = this.m_pScene.Params().baseScore;
            this.m_SlitherInfo.score -= score;
            if (this.m_SlitherInfo.score <= baseScore) {
                this.m_SlitherInfo.score = baseScore;
                reachedBase = true;
            }
            this.m_SlitherInfo.width = this.m_pScene.ScroreToWidth(this.m_SlitherInfo.score);
            this.m_SlitherInfo.length = this.m_pScene.ScoreToLength(this.m_SlitherInfo.score);
            var count = this.CalculatePointCount();
            while (this.m_Points.length > count) {
                this.m_Points.pop();
                this.m_PointsDirty = true;
            }
            return reachedBase;
        };
        SlitherBase.prototype.EndPointIndex = function () { return this.m_EndPointIndex; };
        SlitherBase.prototype.SetSlitherCmd = function (targetDir, accelarating) {
            this.m_SlitherInfo.accelarating = accelarating;
            this.m_TargetDirection = snake.Normalize(targetDir);
        };
        SlitherBase.prototype.PointData = function () {
            return this.m_Points[0];
        };
        SlitherBase.prototype.Points = function () {
            return this.m_Points;
        };
        SlitherBase.prototype.PointCount = function () {
            return this.m_Points.length;
        };
        SlitherBase.prototype.Position = function () {
            return this.m_SlitherInfo.head;
        };
        SlitherBase.prototype.Direction = function () {
            return this.m_Direction;
        };
        SlitherBase.prototype.Accelarating = function () {
            return this.m_SlitherInfo.accelarating ? true : false;
        };
        SlitherBase.prototype.Width = function () {
            return this.m_SlitherInfo.width;
        };
        SlitherBase.prototype.Score = function () {
            return this.m_SlitherInfo.score;
        };
        SlitherBase.prototype.Rank = function () {
            return this.m_SlitherInfo.rank;
        };
        SlitherBase.prototype.setRank = function (rank) {
            this.m_SlitherInfo.rank = rank;
        };
        SlitherBase.prototype.Speed = function () {
            return this.m_SlitherInfo.speed;
        };
        SlitherBase.prototype.ID = function () {
            return this.m_SlitherInfo.id;
        };
        SlitherBase.prototype.SkinID = function () {
            return this.m_SlitherInfo.skinID;
        };
        SlitherBase.prototype.Bounds = function () {
            return this.m_AABB;
        };
        SlitherBase.prototype.Info = function () {
            return this.m_SlitherInfo;
        };
        return SlitherBase;
    }());
    snake.SlitherBase = SlitherBase;
    __reflect(SlitherBase.prototype, "snake.SlitherBase");
    ;
})(snake || (snake = {}));
var snake;
(function (snake) {
    snake.FOLLOW_FACTOR = 1.0;
    snake.BEAN_MIN_DISTFACTOR = 2.0;
    snake.AI_VIEW_ASPECT = 2.0;
    snake.AVOID_ITERATION = 3;
    snake.BEAN_POS_REACH_DIST2 = 1.0;
    snake.CIRCLING_DIST2 = 2.25;
    snake.CIRCLING_TIME = 5.0;
    var Strategy;
    (function (Strategy) {
        Strategy[Strategy["Attacking"] = 0] = "Attacking";
        Strategy[Strategy["Eatting"] = 1] = "Eatting";
        Strategy[Strategy["Desperated"] = 2] = "Desperated";
    })(Strategy = snake.Strategy || (snake.Strategy = {}));
    ;
    var Slither = (function (_super) {
        __extends(Slither, _super);
        function Slither() {
            var _this = _super.call(this) || this;
            _this.m_CornerPos = new snake.Vector2();
            _this.m_SmoothTargetDirection = new snake.Vector2();
            _this.m_MostThreateningPos = new snake.Vector2();
            _this.m_AHeadPos = new snake.Vector2();
            _this.m_FollowPos = new snake.Vector2();
            _this.m_LastBeanPos = new snake.Vector2();
            _this.m_CirclingCheckPosition = new snake.Vector2();
            _this.m_LastThinkTime = -10.0;
            _this.m_LastWanderTime = -10.0;
            _this.m_LastAccelarateTime = -10.0;
            _this.m_ThinkInterval = 0.0;
            _this.m_WanderInterval = 0.0;
            _this.m_AccelarateInterval = 0.0;
            _this.m_CirclingCheckTime = 0.0;
            _this.m_CirclingChecking = false;
            _this.m_LastAttackTarget = 0;
            _this.m_Strategy = Strategy.Eatting;
            _this.m_AvoidRadiusRT = 0.0;
            _this.m_Enable = false;
            _this.m_AIParams = new snake.AIParams();
            return _this;
        }
        Slither.prototype.ExecuteStrategy = function (time, dir, accelarate) {
            var target = new snake.Vector2();
            switch (this.m_Strategy) {
                case Strategy.Eatting:
                    if (this.FindBeanTarget(target, false)) {
                        this.Follow(target, dir);
                    }
                    else {
                        this.Wander(time, dir);
                    }
                    if (this.CanChangeStrategy(time) && this.CanKill() && snake.uniform_random(0.0, 1.0) < this.m_AIParams.agressive) {
                        this.m_Strategy = Strategy.Attacking;
                    }
                    if (this.CirclingCheck(time, snake.CIRCLING_DIST2)) {
                        this.m_Strategy = Strategy.Desperated;
                    }
                    this.DoAccelarate(time, accelarate);
                    break;
                case Strategy.Attacking:
                    if (this.FindBeanTarget(target, true)) {
                        this.Follow(target, dir);
                    }
                    else if (this.m_LastAttackTarget != 0 && !this.m_pScene.IsPlayerAlive(this.m_LastAttackTarget)) {
                        this.m_Strategy = Strategy.Eatting;
                        this.m_LastAttackTarget = 0;
                    }
                    else if (this.CanKill() && this.FindAttackTarget(target)) {
                        accelarate = true;
                        this.Follow(target, dir);
                    }
                    else {
                        this.m_Strategy = Strategy.Eatting;
                    }
                    if (this.CirclingCheck(time, snake.CIRCLING_DIST2)) {
                        this.m_Strategy = Strategy.Desperated;
                    }
                    break;
                case Strategy.Desperated:
                    if (!this.CirclingCheck(time, snake.CIRCLING_DIST2 * 2.5)) {
                        this.m_Strategy = Strategy.Eatting;
                    }
                    else {
                        this.Wander(time, dir);
                        accelarate = false;
                    }
                    break;
            }
        };
        Slither.prototype.CanChangeStrategy = function (time) {
            if (time - this.m_LastThinkTime >= this.m_ThinkInterval) {
                this.m_ThinkInterval = snake.uniform_random(this.m_AIParams.minThinkInterval, this.m_AIParams.maxThinkInterval);
                this.m_LastThinkTime = time;
                return true;
            }
            return false;
        };
        Slither.prototype.CirclingCheck = function (time, dist) {
            if (this.m_CirclingChecking) {
                var widthFactor2 = this.Width() / 0.32;
                var ccp = this.Position().sub(this.m_CirclingCheckPosition);
                if (ccp.SquareMagnitude() > dist * widthFactor2 * this.m_AIParams.desperateFactor) {
                    this.m_CirclingChecking = false;
                }
                else if (time - this.m_CirclingCheckTime > snake.CIRCLING_TIME) {
                    return true;
                }
            }
            else {
                this.m_CirclingCheckPosition.vec = this.Position();
                this.m_CirclingCheckTime = time;
                this.m_CirclingChecking = true;
            }
            return false;
        };
        Slither.prototype.Avoidance = function (time, bestDir) {
            if (this.m_Strategy == Strategy.Desperated) {
                return;
            }
            var maxWeight = 0.0;
            var mostThreateningPos = new snake.Vector2(0.0, 0.0);
            var currentBest = new snake.Vector2();
            currentBest.SetVec(bestDir);
            var sumDir = new snake.Vector2();
            var iteration = 0;
            while (iteration++ < snake.AVOID_ITERATION) {
                var aheadDir = snake.Slerp(this.m_Direction, currentBest, 0.5);
                if (this.FindMostThreateningPos(aheadDir, mostThreateningPos)) {
                    var v = this.m_Points[0].sub(mostThreateningPos);
                    var dist = v.Magnitude();
                    if (dist > 1e-4) {
                        var weight = this.m_AvoidRadiusRT / (dist + 1e-4);
                        if (weight > maxWeight) {
                            maxWeight = weight;
                            this.m_MostThreateningPos = mostThreateningPos;
                        }
                        currentBest = v.divAssignment(dist);
                        sumDir.addAssignment(currentBest.mul(weight));
                    }
                }
                else {
                    sumDir = currentBest;
                    break;
                }
            }
            bestDir = snake.Normalize(sumDir);
        };
        Slither.prototype.Wander = function (time, dir) {
            if (time - this.m_LastWanderTime >= this.m_WanderInterval) {
                dir.SetVec(snake.random_on_unitcircle());
                this.m_WanderInterval = snake.uniform_random(this.m_AIParams.minWanderInterval, this.m_AIParams.maxWanderInterval);
                this.m_LastWanderTime = time;
            }
        };
        Slither.prototype.Follow = function (pos, dir) {
            var ff = snake.Normalize(pos.sub(this.m_Points[0])).mul(snake.FOLLOW_FACTOR);
            dir.addAssignment(ff);
            dir.vec = snake.Normalize(dir);
            this.m_FollowPos.vec = pos;
        };
        Slither.prototype.SmoothSteering = function (dir) {
            if (this.m_SmoothTargetDirection.IsZero()) {
                this.m_SmoothTargetDirection.vec = dir;
            }
            else {
                if (this.m_Strategy != Strategy.Attacking) {
                    this.m_SmoothTargetDirection.vec = dir;
                }
                else {
                    var diff = (1.0 - snake.Dot(dir, this.m_SmoothTargetDirection)) * 0.5;
                    if (diff > 0.1) {
                        this.m_SmoothTargetDirection.vec = snake.Slerp(this.m_SmoothTargetDirection, dir, 0.2);
                    }
                }
                dir.vec = this.m_SmoothTargetDirection;
            }
        };
        Slither.prototype.DoAccelarate = function (time, accelarate) {
            if (time - this.m_LastAccelarateTime >= this.m_AccelarateInterval) {
                this.m_AccelarateInterval = snake.uniform_random(1.0, 6.0);
                this.m_LastAccelarateTime = time;
                accelarate = this.CanAccelarte() && snake.uniform_random(0.0, 1.0) < this.m_AIParams.agile;
            }
        };
        Slither.prototype.FindBeanTarget = function (target, fromSlitherOnly) {
            if (this.m_AIParams.findBeanDist < 1e-4) {
                return false;
            }
            if (!this.m_LastBeanPos.IsZero()) {
                var smm = this.Position().sub(this.m_LastBeanPos);
                if (smm.SquareMagnitude() < snake.BEAN_POS_REACH_DIST2) {
                    this.m_LastBeanPos = new snake.Vector2();
                    return false;
                }
                else {
                    target.vec = this.m_LastBeanPos;
                    return true;
                }
            }
            var extent = this.m_pScene.WidthToView(this.Width()) * this.m_AIParams.findBeanDist;
            var center = this.m_Points[0];
            var min = center.sub(extent);
            var max = center.add(extent);
            var beans = this.m_pScene.Beans().FindInRangeFilter(min, max, new snake.DefaultFilter());
            var minDist2 = snake.FLT_MAX;
            var speedFactor2 = this.Speed().SquareMagnitude() / (this.m_pScene.Params().linearSpeedNormal * this.m_pScene.Params().linearSpeedNormal);
            var threshold = this.Width() * snake.BEAN_MIN_DISTFACTOR;
            var threshold2 = threshold * threshold * speedFactor2;
            var min_val = this.m_pScene.Params().initialBeanMin;
            var found = false;
            var count = beans.length;
            for (var i = 0; i < count; ++i) {
                var bean = beans[i];
                if (!bean.fromSlither) {
                    if (bean.valReal < min_val) {
                        continue;
                    }
                    if (fromSlitherOnly) {
                        continue;
                        ;
                    }
                }
                var dist2 = (bean.position.sub(center)).SquareMagnitude();
                var weightInv = bean.fromSlither ? 0.1 : 1.0;
                var dist2Weighted = dist2 * weightInv;
                if (threshold2 < dist2 && dist2Weighted < minDist2) {
                    minDist2 = dist2Weighted;
                    target.vec = bean.position;
                    this.m_LastBeanPos = target;
                    found = true;
                }
            }
            return found;
        };
        Slither.prototype.FindAttackTarget = function (target) {
            var extent = this.m_pScene.WidthToView(this.Width()) * snake.AI_VIEW_ASPECT;
            var center = this.m_Points[0];
            if (this.m_LastAttackTarget != 0) {
                var pSlither_1 = this.m_pScene.FindSlither(this.m_LastAttackTarget);
                if (pSlither_1 != null) {
                    var otherPos = pSlither_1.Position();
                    var dist2 = otherPos.sub(center).SquareMagnitude();
                    if (dist2 < extent * extent) {
                        target.vec = otherPos.add(pSlither_1.Direction().mul(pSlither_1.Width() * this.m_AIParams.aHeadDist));
                        return true;
                    }
                }
            }
            this.m_LastAttackTarget = 0;
            var view = snake.AABB.createAABB(center.sub(extent), center.sub(extent));
            var highScore = 0.0;
            var pSlither = null;
            var slithers = this.m_pScene.FindSlithersInView(view);
            var count = slithers.length;
            for (var i = 0; i < count; ++i) {
                if (slithers[i].ID() == this.ID()) {
                    continue;
                }
                var weight = snake.IsAI(this.ID()) ? 1.0 : 1.0;
                var otherScore = weight * slithers[i].Score();
                if (otherScore > highScore) {
                    pSlither = slithers[i];
                    highScore = otherScore;
                }
            }
            if (pSlither != null) {
                target.vec = pSlither.Position().add(pSlither.Direction().mul(pSlither.Width() * this.m_AIParams.aHeadDist));
                this.m_LastAttackTarget = pSlither.ID();
            }
            return pSlither != null;
        };
        Slither.prototype.FindMostThreateningPos = function (dir, mostThreateningPos) {
            var params = this.m_pScene.Params();
            var speedFactor = Math.sqrt(this.Speed().Magnitude() / params.linearSpeedNormal);
            var aheadDist = this.m_AIParams.aHeadDist * this.Width() * speedFactor;
            this.m_AHeadPos.vec = this.m_Points[0].add(dir.mul(aheadDist));
            this.m_AvoidRadiusRT = speedFactor * this.m_AIParams.avoidRadius * this.Width();
            // Slithers
            var slithers = this.m_pScene.AllSlithers();
            var count = slithers.length;
            var collisionRadius = this.m_AvoidRadiusRT + aheadDist;
            var mostThreateningDist = snake.FLT_MAX;
            var found = false;
            for (var i = 0; i < count; ++i) {
                var pSlither = slithers[i];
                if (pSlither.ID() == this.m_SlitherInfo.id) {
                    continue;
                }
                if (!pSlither.Bounds().IntersectVec(this.m_Points[0], collisionRadius)) {
                    continue;
                }
                if (this.FindSlitherPoint(pSlither, this.m_AvoidRadiusRT, this.m_AHeadPos, mostThreateningPos, mostThreateningDist)) {
                    found = true;
                }
            }
            if (!found) {
                // Scene Border
                var safeSceneRadius = params.radius - this.m_AvoidRadiusRT - 1.0;
                var vcenter = this.m_Points[0].sub(this.m_pScene.Center());
                if (vcenter.SquareMagnitude() > safeSceneRadius * safeSceneRadius) {
                    mostThreateningPos.vec = this.m_Points[0].add(snake.Normalize(vcenter).mul(this.m_AvoidRadiusRT));
                    found = true;
                }
            }
            return found;
        };
        Slither.prototype.WayIntersects = function (pos, radius, ahead, otherPos, otherRaidus) {
            var r2 = radius + otherRaidus;
            r2 *= r2;
            return pos.sub(otherPos).SquareMagnitude() < r2 || ahead.sub(otherPos).SquareMagnitude() < r2;
        };
        Slither.prototype.FindSlitherPoint = function (other, avoidRadius, ahead, mostThreateningPos, mostThreateningDist) {
            var params = this.m_pScene.Params();
            var otherPoints = other.PointData();
            var otherCount = other.PointCount();
            var otherRaidus = other.Width() * 0.5;
            var found = false;
            var pos = this.m_Points[0];
            for (var i = 0; i < otherCount; ++i) {
                var otherPos = otherPoints[i];
                if (this.WayIntersects(pos, avoidRadius, ahead, otherPos, otherRaidus)) {
                    var dist2 = pos.sub(otherPos).SquareMagnitude();
                    if (dist2 < mostThreateningDist) {
                        mostThreateningDist = dist2;
                        mostThreateningPos = otherPos;
                        if (i < params.headTestStart && this.Width() > other.Width()) {
                            continue;
                        }
                        found = true;
                    }
                }
            }
            return found;
        };
        Slither.prototype.CanAccelarte = function () {
            return this.Score() > this.m_pScene.Params().aiAccelarateMinScore;
        };
        Slither.prototype.CanKill = function () {
            return this.CanAccelarte() && this.Score() > this.m_pScene.Params().aiKillMinScore;
        };
        Slither.prototype.Update = function (time, deltaTime) {
            if (this.m_Enable) {
                var dir = this.m_TargetDirection;
                var accelarate = this.Accelarating();
                this.ExecuteStrategy(time, dir, accelarate);
                this.Avoidance(time, dir);
                this.SmoothSteering(dir);
                this.SetSlitherCmd(dir, accelarate);
            }
            _super.prototype.Update.call(this, time, deltaTime);
        };
        Slither.prototype.EnableAI = function (enable) { this.m_Enable = enable; };
        Slither.prototype.IsEnableAI = function () { return this.m_Enable; };
        Slither.prototype.SetAIParams = function (params) {
            if (params != null) {
                this.m_AIParams = params;
                this.m_ScoreFactor = this.m_AIParams.eatBeanFactor;
                this.m_Enable = true;
            }
            else {
                this.m_ScoreFactor = 1.0;
                this.m_Enable = false;
            }
        };
        Slither.prototype.GetAIParams = function () { return this.m_AIParams; };
        return Slither;
    }(snake.SlitherBase));
    snake.Slither = Slither;
    __reflect(Slither.prototype, "snake.Slither");
    ;
})(snake || (snake = {}));
var snake;
(function (snake) {
    snake.MAX_AI_ID = 1000000;
    snake.SPATIAL_NUM = 40;
    snake.ID_BUCKET_NUM = 1000;
    snake.VIEW_ASPECT = 2.2;
    function IsAI(x) {
        return x < snake.MAX_AI_ID;
    }
    snake.IsAI = IsAI;
    var SortSlitherInfo = (function () {
        function SortSlitherInfo() {
        }
        SortSlitherInfo.operator = function (lhs, rhs) {
            if (lhs.score > rhs.score)
                return 1;
            return 0;
        };
        return SortSlitherInfo;
    }());
    snake.SortSlitherInfo = SortSlitherInfo;
    __reflect(SortSlitherInfo.prototype, "snake.SortSlitherInfo");
    ;
    var CollisionContext = (function () {
        function CollisionContext() {
            this.dieMap = new Object();
        }
        CollisionContext.prototype.add = function (key, value) {
            this.dieMap[key] = value;
        };
        CollisionContext.prototype.find = function (key) {
            return this.dieMap[key];
        };
        return CollisionContext;
    }());
    snake.CollisionContext = CollisionContext;
    __reflect(CollisionContext.prototype, "snake.CollisionContext");
    ;
    var Scene = (function () {
        function Scene() {
            this.m_PlayerTable = new snake.ValMap();
            this.m_AITable = new snake.ValMap();
            this.m_BeanTable = new snake.FixedSpatialItemContainer();
            this.m_ViewTable = new snake.ValMap();
            this.m_Center = new snake.Vector2();
            this.m_HistorySlitherInfo = new snake.ValMap();
            this.m_BeanIDQueue = [];
            this.m_ScoreWidth = [];
            this.m_ScoreLength = [];
            this.m_WidthView = [];
            this.m_WidthRotationNormal = [];
            this.m_WidthRotationFast = [];
            this.m_AllSlithers = [];
            this.m_CacheSlithersForQuery = [];
            this.m_CacheKillBean = [];
            this.m_CacheBeansForQuery = [];
            this.m_CacheBeanDevoured = [];
            this.m_CacheSlitherInfoForQuery = [];
            this.m_LastTime = -1.0, this.m_LastCompensateTime = -1.0, this.m_AIIDCounter = 1, this.m_ViewIDCounter = 1;
        }
        Scene.prototype.WriteBufferByte = function (buff, offset, value) {
            buff[offset] = value;
        };
        Scene.prototype.WriteBufferSlitherHeadInfo = function (buff, offset, slither) {
            var info = slither.Info();
            buff[offset] = info.id;
            offset += 1;
            var speed = info.speed;
            var head = info.head;
            buff[offset] = speed.x;
            offset += 1;
            buff[offset] = speed.y;
            offset += 1;
            buff[offset] = head.x;
            offset += 1;
            buff[offset] = head.y;
            offset += 1;
            buff[offset] = info.length;
            offset += 1;
            buff[offset] = info.width;
            offset += 1;
            return 7;
        };
        Scene.prototype.WriteBufferBirthDeathInfo = function (buff, offset, headInfo) {
            buff[offset] = headInfo.type;
            offset += 1;
            buff[offset] = headInfo.id;
            offset += 1;
            return 2;
        };
        Scene.prototype.WriteBufferSlitherBodyInfo = function (bytes, offset, maxSize, slither) {
            var count = slither.PointCount();
            if (offset + count * 2 + 2 > maxSize) {
                return 0;
            }
            this.WriteBufferByte(bytes, offset, slither.ID());
            offset++;
            this.WriteBufferByte(bytes, offset, count);
            offset++;
            var mPoints = slither.Points();
            for (var i = 0; i < count; ++i) {
                var pack = mPoints[i];
                this.WriteBufferByte(bytes, offset, pack.x);
                offset++;
                this.WriteBufferByte(bytes, offset, pack.y);
                offset++;
            }
            return 2 + count * 2;
        };
        Scene.prototype.AcquireBeanID = function () {
            var id = this.m_BeanIDQueue.shift();
            return id;
        };
        Scene.prototype.ReleaseBeanID = function (id) {
            this.m_BeanIDQueue.push(id);
        };
        //public -----------------------------------------------------------------
        Scene.prototype.FindSlither = function (id) { return IsAI(id) ? this.m_AITable.find(id) : this.m_PlayerTable.find(id); };
        Scene.prototype.ScroreToWidth = function (score) {
            return this.ValueToValue(this.m_Params.scoreWidth, this.m_Params.scoreWidthCount, score);
        };
        Scene.prototype.ScoreToLength = function (score) {
            return this.ValueToValue(this.m_Params.scoreLength, this.m_Params.scoreLengthCount, score);
        };
        Scene.prototype.WidthToView = function (width) {
            return this.ValueToValue(this.m_Params.widthView, this.m_Params.widthViewCount, width);
        };
        Scene.prototype.WidthToRotateNormal = function (width) {
            return this.ValueToValue(this.m_Params.widthRotateNormal, this.m_Params.widthRotateNormalCount, width);
        };
        Scene.prototype.WidthToRotateFast = function (width) {
            return this.ValueToValue(this.m_Params.widthRotateFast, this.m_Params.widthRotateFastCount, width);
        };
        Scene.prototype.Beans = function () { return this.m_BeanTable; };
        Scene.prototype.AllSlithers = function () { return this.m_AllSlithers; };
        Scene.prototype.Params = function () { return this.m_Params; };
        Scene.prototype.Center = function () { return this.m_Center; };
        Scene.prototype.GetHistorySlitherInfo = function (playerID) { return this.m_HistorySlitherInfo.find(playerID); };
        Scene.prototype.AllSlitherInfoByRank = function () { return this.m_CacheSlitherInfoForQuery; };
        Scene.prototype.IsPlayerAlive = function (playerID) { return this.FindSlither(playerID) != null; };
        Scene.prototype.GetAllSlitherCount = function () { return this.GetAICount() + this.GetPlayerCount(); };
        Scene.prototype.ConfineInRange = function (pos, center, r) {
            if (r <= 0.0) {
                return pos;
            }
            var v = pos.sub(center);
            var d = v.Magnitude();
            if (d > r) {
                return v.divAssignment(d).mulAssignment(r).addAssignment(center);
            }
            else {
                return pos;
            }
        };
        Scene.prototype.IsPositionFit = function (pos, emptySpace, slithers) {
            var count = slithers.length;
            for (var i = 0; i < count; ++i) {
                var bounds = slithers[i].Bounds();
                if (bounds.IntersectVec(pos, emptySpace)) {
                    return false;
                }
            }
            return true;
        };
        Scene.prototype.RemoveSlither = function (slithers, id) {
            for (var it = slithers.length - 1; it >= 0; --it) {
                if (slithers[it].ID() == id) {
                    slithers.splice(it, 1);
                    return;
                }
            }
        };
        Scene.prototype.ContainsSlitherID = function (slithers, id) {
            for (var it = slithers.length - 1; it >= 0; --it) {
                if (slithers[it].ID() == id) {
                    return true;
                }
            }
            return false;
        };
        Scene.prototype.ClampInBorder = function (pos, center, radius) {
            var v = pos.sub(center);
            var dist2 = v.SquareMagnitude();
            if (dist2 > radius * radius) {
                return v.mulAssignment(radius).divAssignment(Math.sqrt(dist2)).addAssignment(center);
            }
            else {
                return pos;
            }
        };
        //////////////////////////////////////////////////////////////////////////
        Scene.prototype.Initialize = function (params) {
            this.m_ScoreWidth.length = 0;
            this.m_ScoreWidth = this.m_ScoreWidth.concat(params.scoreWidth);
            this.m_ScoreLength.length = 0;
            this.m_ScoreLength = this.m_ScoreLength.concat(params.scoreLength);
            this.m_WidthView.length = 0;
            this.m_WidthView = this.m_WidthView.concat(params.widthView);
            this.m_WidthRotationNormal.length = 0;
            this.m_WidthRotationNormal = this.m_WidthRotationNormal.concat(params.widthRotateNormal);
            this.m_WidthRotationFast.length = 0;
            this.m_WidthRotationFast = this.m_WidthRotationFast.concat(params.widthRotateFast);
            //srand((uint)params.randSeed);
            this.m_Params = params;
            this.m_Params.scoreWidth = this.m_ScoreWidth;
            this.m_Params.scoreLength = this.m_ScoreLength;
            this.m_Params.widthView = this.m_WidthView;
            this.m_Params.widthRotateNormal = this.m_WidthRotationNormal;
            this.m_Params.widthRotateFast = this.m_WidthRotationFast;
            var radius = params.radius;
            this.m_Center.SetTo(radius, radius);
            this.m_BeanTable.Initialize(this.m_Center.sub(radius), this.m_Center.add(radius), snake.SPATIAL_NUM, snake.SPATIAL_NUM);
            this.ResetBeanIDQueue();
            this.AdjustInitialBeans();
        };
        Scene.prototype.AdjustInitialBeans = function () {
            var bean;
            var dvt = Math.sqrt(this.m_Params.radius) * this.m_Params.initialBeanSigma;
            var r2 = this.m_Params.radius - 1.0;
            r2 *= r2;
            while (this.m_BeanTable.Count() < Math.ceil(this.m_Params.initialBeanCount)) {
                var pos = snake.random_gaussian_disk(dvt);
                if (pos.SquareMagnitude() < r2) {
                    bean = new snake.Bean();
                    bean.position.vec = this.m_Center.add(pos);
                    bean.id = this.AcquireBeanID();
                    bean.valReal = snake.uniform_random(this.m_Params.initialBeanMin, this.m_Params.initialBeanMax);
                    bean.valVisual = bean.valReal * this.m_Params.scoreVisualScale;
                    bean.slitherID = 0;
                    bean.fromSlither = false;
                    this.m_BeanTable.Add(bean);
                }
            }
        };
        Scene.prototype.ResetBeanIDQueue = function () {
            this.m_BeanIDQueue.length = 0;
            for (var i = 1; i < 10000; ++i) {
                this.m_BeanIDQueue.push(i);
            }
        };
        Scene.prototype.AdjustSceneParams = function (params) {
            this.m_Params.initialBeanCount = params.initialBeanCount;
            this.m_Params.compensateBeanThreshold = params.compensateBeanThreshold;
            this.AdjustInitialBeans();
        };
        Scene.prototype.ValueToValue = function (v, count, value) {
            if (count == 0) {
                return 0.0;
            }
            var right = count - 1;
            for (var i = 0; i < count; ++i) {
                if (v[i].x >= value) {
                    right = i;
                    break;
                }
            }
            if (right == 0) {
                return v[0].y;
            }
            else {
                var k = (value - v[right - 1].x) / (v[right].x - v[right - 1].x);
                //assert(0.0f <= k && k <= 1.0f);
                //return k * v[right].y + (1.0f - k) * v[right - 1].y;
                return snake.lerp(v[right - 1].y, v[right].y, k);
            }
        };
        Scene.prototype.UpdateScene = function (time) {
            this.m_CacheBeanDevoured.length = 0;
            var cc = new CollisionContext();
            this.UpdateKillBeanDevour();
            this.UpdateMove(time);
            this.UpdateCollision(cc);
            this.UpdateView();
            this.UpdateCacheSlitherInfoForQuery();
            this.CompensateBeans(time);
            this.NotifyBeanDevoured();
        };
        Scene.prototype.UpdateMove = function (time) {
            //PROFILE("UpdateMove");
            if (this.m_LastTime < 0.0) {
                this.m_LastTime = time;
            }
            var dt = time - this.m_LastTime;
            this.m_LastTime = time;
            var count = this.m_AllSlithers.length;
            for (var i = 0; i < count; ++i) {
                var slither = this.m_AllSlithers[i];
                slither.Update(time, dt);
            }
        };
        Scene.prototype.UpdateCollision = function (cc) {
            //PROFILE("UpdateCollision");
            var count = this.m_AllSlithers.length;
            for (var i = 0; i < count; ++i) {
                var slither = this.m_AllSlithers[i];
                slither.UpdateCollision(cc);
            }
            this.UpdateHistorySlitherInfo(cc);
            for (var it in cc.dieMap) {
                var id = cc.dieMap[it];
                var slither = this.FindSlither(id);
                if (slither != null) {
                    this.RemoveSlither(this.m_AllSlithers, id);
                    if (IsAI(id)) {
                        this.m_AITable.remove(id);
                    }
                    else {
                        this.m_PlayerTable.remove(id);
                    }
                }
            }
        };
        Scene.prototype.UpdateHistorySlitherInfo = function (cc) {
            var count = this.m_AllSlithers.length;
            for (var i = 0; i < count; ++i) {
                var slither = this.m_AllSlithers[i];
                var ID = slither.ID();
                var pInfo = this.m_HistorySlitherInfo.find(ID);
                var info = slither.Info();
                if (pInfo == null) {
                    pInfo = this.m_HistorySlitherInfo.add(ID, info);
                }
                else {
                    this.m_HistorySlitherInfo.setVal(ID, info);
                }
            }
        };
        Scene.prototype.CompensateBeans = function (time) {
            if (time - this.m_LastCompensateTime < this.m_Params.compensateBeanInterval) {
                return;
            }
            var count = this.m_AllSlithers.length;
            for (var i = 0; i < count; ++i) {
                var slither = this.m_AllSlithers[i];
                if (slither.Score() < this.m_Params.compensateBeanThreshold) {
                    var pos = slither.Position();
                    var dir = snake.Normalize(this.m_Center.sub(pos));
                    pos.addAssignment(dir.mul(this.m_Params.compensateBeanDistance));
                    pos.addAssignment(snake.random_in_unitcircle().mulAssignment(this.m_Params.compensateBeanRadius));
                    for (var k = 0; k < this.m_Params.compensateBeanCount; ++k) {
                        var rndPos = pos.add(snake.random_in_unitcircle());
                        rndPos = this.ClampInBorder(rndPos, this.Center(), this.m_Params.radius * 0.9);
                        var val = snake.uniform_random(this.m_Params.initialBeanMin, this.m_Params.initialBeanMax);
                        this.GenerateBean(rndPos, val * this.m_Params.scoreVisualScale, val);
                    }
                }
            }
            this.m_LastCompensateTime = time;
        };
        Scene.prototype.NotifyBeanDevoured = function () {
            var list = this.m_ViewTable.list;
            var size = list.length;
            for (var it = 0; it < size; ++it) {
                list[it].NotifyBeanDevoured(this.m_CacheBeanDevoured);
            }
        };
        Scene.prototype.UpdateCacheSlitherInfoForQuery = function () {
            var count = this.m_AllSlithers.length;
            var query = this.m_CacheSlitherInfoForQuery;
            query.length = 0;
            for (var i = 0; i < count; ++i) {
                var slither = this.m_AllSlithers[i];
                query.push(slither.Info());
            }
            query.sort(SortSlitherInfo.operator);
            for (var i = 0; i < count; ++i) {
                var playerID = query[i].id;
                var slither = this.FindSlither(playerID);
                if (slither != null) {
                    slither.setRank(i + 1);
                }
                query[i].rank = i + 1;
            }
        };
        Scene.prototype.UpdateKillBeanDevour = function () {
            var count = this.m_CacheKillBean.length;
            for (var i = 0; i < count; ++i) {
                var bean = this.m_CacheKillBean[i];
                this.DevourBean(bean, bean.slitherID, true);
            }
            this.m_CacheKillBean.length = 0;
        };
        Scene.prototype.UpdateView = function () {
            var list = this.m_ViewTable.list;
            var size = list.length;
            for (var it = 0; it < size; ++it) {
                list[it].Update();
            }
        };
        Scene.prototype.CreateSlitherAI = function (initialScore, skinID, aiParams, pos, dir) {
            if (snake.Distance(pos, this.m_Center) >= this.m_Params.radius) {
                return 0;
            }
            var AIID = this.m_AIIDCounter++ % snake.MAX_AI_ID;
            var ai = this.m_AITable.add(AIID, new snake.Slither());
            ai.Initialize(this, AIID, skinID, initialScore, pos, dir);
            ai.SetAIParams(aiParams);
            this.m_AllSlithers.push(ai);
            return AIID;
        };
        Scene.prototype.CreateSlitherPlayer = function (playerID, initialScore, skinID, pos, dir) {
            if (this.IsPlayerAlive(playerID)) {
                return false;
            }
            var player = this.m_PlayerTable.add(playerID, new snake.Slither());
            player.Initialize(this, playerID, skinID, initialScore, pos, dir);
            this.m_AllSlithers.push(player);
            return true;
        };
        Scene.prototype.SetSlitherAI = function (playerID, params) {
            var slither = this.FindSlither(playerID);
            if (slither != null) {
                slither.SetAIParams(params);
            }
        };
        Scene.prototype.SetSlitherPlayerCmd = function (playerID, targetDir, accelarating) {
            var slither = this.FindSlither(playerID);
            if (slither != null) {
                slither.SetSlitherCmd(targetDir, accelarating);
            }
        };
        Scene.prototype.FindBestFitPosition = function (emptySize, maxTryCount, outsideFirst, optimalPos, outPos) {
            var borderFactor = 0.8;
            var try_count = 0;
            if (optimalPos.IsZero()) {
                if (outsideFirst) {
                    var firstTryPos = new snake.Vector2();
                    while (try_count < maxTryCount) {
                        var k = 1.0 - (try_count / maxTryCount);
                        //Vector2 pos = this.m_Center + random_on_unitcircle() * k * this.m_Params.radius * borderFactor;
                        var pos = this.m_Center.add(snake.random_on_unitcircle().mulAssignment(k * this.m_Params.radius * borderFactor));
                        ++try_count;
                        if (firstTryPos.IsZero()) {
                            firstTryPos.SetVec(pos);
                        }
                        if (this.IsPositionFit(pos, emptySize, this.m_AllSlithers)) {
                            outPos.SetVec(pos);
                            return true;
                        }
                    }
                    outPos.SetVec(firstTryPos);
                }
                else {
                    while (try_count < maxTryCount) {
                        var pos = snake.random_in_unitcircle().mulAssignment(this.m_Params.radius * borderFactor).addAssignment(this.m_Center);
                        outPos.SetVec(pos);
                        ++try_count;
                        if (this.IsPositionFit(pos, emptySize, this.m_AllSlithers)) {
                            return true;
                        }
                    }
                }
            }
            else {
                while (try_count < maxTryCount) {
                    var k = (try_count + 1.0) / maxTryCount;
                    var pos = snake.random_on_unitcircle().mulAssignment(k * this.m_Params.radius).addAssignment(optimalPos);
                    pos = this.ConfineInRange(pos, this.m_Center, this.m_Params.radius * borderFactor);
                    outPos.SetVec(pos);
                    ++try_count;
                    if (this.IsPositionFit(pos, emptySize, this.m_AllSlithers)) {
                        return true;
                    }
                }
            }
            return false;
        };
        Scene.prototype.DevourBean = function (bean, slitherID, kill) {
            var id = bean.id;
            var beanDevoured = new snake.BeanDevoured();
            beanDevoured.id = bean.id;
            beanDevoured.position.vec = bean.position;
            beanDevoured.slitherID = slitherID;
            beanDevoured.kill = kill;
            this.m_CacheBeanDevoured.push(beanDevoured);
            this.m_BeanTable.Remove(bean);
            this.ReleaseBeanID(id);
        };
        Scene.prototype.GenerateBean = function (pos, valVisual, valReal) {
            var bean = new snake.Bean();
            bean.id = this.AcquireBeanID();
            bean.position.vec = pos;
            bean.valReal = valReal;
            bean.valVisual = valVisual;
            bean.slitherID = 0;
            bean.fromSlither = false;
            this.m_BeanTable.Add(bean);
        };
        Scene.prototype.GenerateBeanOnSlitherDie = function (pSlither, pKiller) {
            var width = pSlither.Width();
            var points = pSlither.Points();
            var pointCount = pSlither.PointCount();
            var Params = this.m_Params;
            var count = Math.ceil(width * pointCount * Params.dieScoreCountRatio);
            var k = count / pointCount;
            var val = (Params.dieScoreBase + pSlither.Score() * Params.dieScorePercent) / count;
            var remain = 0.0;
            var bean;
            for (var i = 0; i < pointCount; ++i) {
                var t = k + remain;
                var ki = Math.ceil(t);
                remain = t - ki;
                for (var j = 0; j < ki; ++j) {
                    var rndOffset = snake.random_in_unitcircle().mulAssignment(0.5 * width * Params.dieScoreRandOffset);
                    bean.id = this.AcquireBeanID();
                    bean.position.vec = points[i].add(rndOffset);
                    bean.valReal = val;
                    bean.valVisual = Params.dieScoreVisualScale * width;
                    bean.slitherID = 0;
                    bean.fromSlither = true;
                    this.m_BeanTable.Add(bean);
                }
            }
            var maxPoint = snake.min(pointCount, Params.killBeanMaxPoint);
            var totalKillScore = Params.killBeanScoreRatio * pSlither.Score();
            val = totalKillScore / Params.killBeanCount;
            for (var i = 0; i < Params.killBeanCount; ++i) {
                var idx = (snake.uniform_random(0.0, 0.99999) * maxPoint);
                var rndOffset = snake.random_in_unitcircle().mulAssignment(0.5 * width * Params.dieScoreRandOffset);
                bean.id = this.AcquireBeanID();
                bean.position.vec = points[idx].add(rndOffset);
                bean.valReal = val;
                bean.valVisual = Params.dieScoreVisualScale * width;
                bean.slitherID = pKiller.ID();
                bean.fromSlither = false;
                this.m_CacheKillBean.push(this.m_BeanTable.Add(bean));
            }
            pKiller.AddScore(totalKillScore);
        };
        Scene.prototype.DeleteAllBeans = function () {
            var beanDevoured;
            var buckets = this.m_BeanTable.Buckets();
            var count = buckets.length;
            for (var i = 0; i < count; ++i) {
                var list = buckets[i];
                var size = list.length;
                for (var it = 0; it < size; ++it) {
                    var bean = list[it];
                    beanDevoured = new snake.BeanDevoured();
                    beanDevoured.id = bean.id;
                    beanDevoured.position.vec = bean.position;
                    beanDevoured.slitherID = 0;
                    beanDevoured.kill = false;
                    this.m_CacheBeanDevoured.push(beanDevoured);
                }
            }
            this.m_BeanTable.Clear();
            this.ResetBeanIDQueue();
        };
        Scene.prototype.DeleteAllSlithers = function () {
            this.m_AITable.clear();
            this.m_PlayerTable.clear();
            this.m_AllSlithers.length = 0;
            this.m_CacheSlithersForQuery.length = 0;
            this.m_CacheSlitherInfoForQuery.length = 0;
        };
        Scene.prototype.GetBeanCount = function () {
            return this.m_BeanTable.Count();
        };
        Scene.prototype.GetAICount = function () {
            return this.m_AITable.size();
        };
        Scene.prototype.GetPlayerCount = function () {
            return this.m_PlayerTable.size();
        };
        Scene.prototype.QueryRankSyncData = function (count, bytes, maxSize) {
            var offset = 0;
            var totalPlayerNum = this.m_CacheSlitherInfoForQuery.length;
            count = snake.min(count, totalPlayerNum);
            if (count == 0) {
                return 0;
            }
            if (maxSize < 6 + 14 * count) {
                return 0;
            }
            this.WriteBufferByte(bytes, offset, count);
            offset++;
            for (var i = 0; i < count; ++i) {
                var playerInfo = this.m_CacheSlitherInfoForQuery[i];
                this.WriteBufferByte(bytes, offset, playerInfo.id);
                offset++;
                this.WriteBufferByte(bytes, offset, playerInfo.score * this.m_Params.scoreScale);
                offset++;
                this.WriteBufferByte(bytes, offset, playerInfo.inTeamNum);
                offset++;
                this.WriteBufferByte(bytes, offset, 0);
                offset++;
            }
            this.WriteBufferByte(bytes, offset, totalPlayerNum);
            offset++;
            return offset;
        };
        Scene.prototype.QueryMiniMapSyncData = function (count, bytes, maxSize) {
            var offset = 0;
            var totalPlayerNum = this.m_CacheSlitherInfoForQuery.length;
            count = snake.min(count, totalPlayerNum);
            if (count == 0) {
                return 0;
            }
            if (maxSize < 18 + 14 * count) {
                return 0;
            }
            this.WriteBufferByte(bytes, offset, count);
            offset++;
            for (var i = 0; i < count; ++i) {
                var playerInfo = this.m_CacheSlitherInfoForQuery[i];
                this.WriteBufferByte(bytes, offset, playerInfo.id);
                offset++;
                this.WriteBufferByte(bytes, offset, playerInfo.head.x);
                offset++;
                this.WriteBufferByte(bytes, offset, playerInfo.head.y);
                offset++;
                this.WriteBufferByte(bytes, offset, 0);
                offset++;
            }
            this.WriteBufferByte(bytes, offset, 0);
            offset++;
            this.WriteBufferByte(bytes, offset, 0);
            offset++;
            this.WriteBufferByte(bytes, offset, 0);
            offset++;
            this.WriteBufferByte(bytes, offset, 0);
            offset++;
            return offset;
        };
        Scene.prototype.CreateView = function (playerID) {
            var view = new snake.View();
            var id = this.m_ViewIDCounter++;
            view.Initialize(this, id, playerID);
            this.m_ViewTable.add(id, view);
            return id;
        };
        Scene.prototype.DeleteView = function (viewID) {
            this.m_ViewTable.remove(viewID);
        };
        Scene.prototype.FindSlithersInView = function (view) {
            this.m_CacheSlithersForQuery.length = 0;
            var count = this.m_AllSlithers.length;
            for (var i = 0; i < count; ++i) {
                var info = this.m_AllSlithers[i];
                if (info.Bounds().Intersect(view)) {
                    this.m_CacheSlithersForQuery.push(info);
                }
            }
            return this.m_CacheSlithersForQuery;
        };
        Scene.prototype.BuildBirthDeath = function (birthDeath, bytes, maxSize) {
            if (birthDeath.length == 0) {
                return 0;
            }
            var totalCount = 0;
            var offset = 1; // reserved for count
            var count = birthDeath.length;
            for (var i = 0; i < count; ++i) {
                if (maxSize - offset < 2) {
                    break;
                }
                ++totalCount;
                this.WriteBufferBirthDeathInfo(bytes, offset, birthDeath[i]);
                offset += 2;
            }
            this.WriteBufferByte(bytes, 0, totalCount);
            return offset;
        };
        Scene.prototype.BuildHeadSyncData = function (slithers, bytes, maxSize) {
            var totalCount = 0;
            var offset = 1; // reserved for count
            var count = slithers.length;
            for (var i = 0; i < count; ++i) {
                if (maxSize - offset < 7) {
                    break;
                }
                ++totalCount;
                this.WriteBufferSlitherHeadInfo(bytes, offset, slithers[i]);
                offset += 7;
            }
            this.WriteBufferByte(bytes, 0, totalCount);
            return offset;
        };
        Scene.prototype.BuildInfoSyncData = function (player, bytes, maxSize) {
            var offset = 0;
            if (player != null) {
                this.WriteBufferByte(bytes, offset, player.rank);
                offset++;
                this.WriteBufferByte(bytes, offset, player.continueKillCount);
                offset++;
                this.WriteBufferByte(bytes, offset, player.totalKillCount);
                offset++;
                this.WriteBufferByte(bytes, offset, player.score * this.m_Params.scoreScale);
                offset++;
            }
            return offset;
        };
        Scene.prototype.BuildBodySyncData = function (slithers, bytes, maxSize) {
            var totalCount = 0;
            var offset = 1; // reserved for count
            var count = slithers.length;
            for (var i = 0; i < count; ++i) {
                var size = this.WriteBufferSlitherBodyInfo(bytes, offset, maxSize, slithers[i]);
                if (size == 0) {
                    break;
                }
                offset += size;
                ++totalCount;
            }
            var offsetX = 0;
            this.WriteBufferByte(bytes, offsetX, totalCount);
            return offset;
        };
        Scene.prototype.BuildBeanSpawnSyncData = function (beans, bytes, maxSize) {
            var totalCount = beans.length;
            if (totalCount == 0) {
                return 0;
            }
            var offset = 1; // reserved for count
            if (maxSize - offset < 4 * totalCount) {
                return 0;
            }
            var size = beans.length;
            for (var it = 0; it < size; ++it) {
                var bean = beans[it];
                var pos = bean.position;
                this.WriteBufferByte(bytes, offset++, bean.id);
                this.WriteBufferByte(bytes, offset++, pos.x);
                this.WriteBufferByte(bytes, offset++, pos.y);
                this.WriteBufferByte(bytes, offset++, bean.valVisual);
            }
            this.WriteBufferByte(bytes, 0, totalCount);
            return offset;
        };
        Scene.prototype.BuildBeanDevouredSyncData = function (beans, kill, bytes, maxSize) {
            var size = beans.length;
            if (size == 0) {
                return 0;
            }
            var offset = 0;
            if (maxSize - offset < 2 + 1 * size + 1 * size) {
                return 0;
            }
            // copy bean id array
            this.WriteBufferByte(bytes, offset++, kill ? 1 : 0);
            var countOffset = offset;
            offset += 1; // reserved for count
            var totalCount = 0;
            for (var it = 0; it < size; ++it) {
                var bean = beans[it];
                this.WriteBufferByte(bytes, offset++, bean.id);
                ++totalCount;
            }
            this.WriteBufferByte(bytes, countOffset, totalCount);
            // copy slither id array
            this.WriteBufferByte(bytes, offset++, totalCount);
            for (var it = 0; it < size; ++it) {
                var bean = beans[it];
                this.WriteBufferByte(bytes, offset++, bean.slitherID);
            }
            beans.length = 0;
            return offset;
        };
        Scene.prototype.QueryPlayerBirthDeath = function (viewID, bytes, maxSize) {
            var view = this.m_ViewTable.find(viewID);
            if (view == null) {
                return 0;
            }
            var i = 0;
            var length = 0;
            var birthDeathInfo = [];
            var lastInView = view.SlithersInView();
            var nowInViewID = [];
            var nowInView = this.FindSlithersInView(view.Bounds());
            i = 0;
            length = lastInView.length;
            for (i = 0; i < length; ++i) {
                var id = lastInView[i];
                if (!this.ContainsSlitherID(nowInView, id)) {
                    var info = new snake.BirthDeathInfo();
                    info.type = snake.BirthDeathType.ExitView;
                    info.id = id;
                    birthDeathInfo.push(info);
                }
            }
            length = nowInView.length;
            for (i = 0; i < length; ++i) {
                var id = nowInView[i].ID();
                nowInViewID.push(id);
                if (lastInView.indexOf(id) == -1) {
                    var info = new snake.BirthDeathInfo();
                    info.type = snake.BirthDeathType.EnterView;
                    info.id = id;
                    birthDeathInfo.push(info);
                }
            }
            length = lastInView.length = nowInViewID.length;
            for (i = 0; i < length; i++) {
                lastInView[i] = nowInViewID[i];
            }
            return this.BuildBirthDeath(birthDeathInfo, bytes, maxSize);
        };
        Scene.prototype.QueryPlayerHeadSyncData = function (viewID, bytes, maxSize) {
            var view = this.m_ViewTable.find(viewID);
            if (view == null) {
                return 0;
            }
            return this.BuildHeadSyncData(this.FindSlithersInView(view.Bounds()), bytes, maxSize);
        };
        Scene.prototype.QueryPlayerInfoSyncData = function (viewID, bytes, maxSize) {
            var view = this.m_ViewTable.find(viewID);
            if (view == null) {
                return 0;
            }
            return this.BuildInfoSyncData(view.GetSlitherInfo(), bytes, maxSize);
        };
        Scene.prototype.QueryPlayerBodySyncData = function (viewID, bytes, maxSize) {
            var view = this.m_ViewTable.find(viewID);
            if (view == null) {
                return 0;
            }
            return this.BuildBodySyncData(this.FindSlithersInView(view.Bounds()), bytes, maxSize);
        };
        Scene.prototype.QueryPlayerBeanSpawnData = function (viewID, bytes, maxSize) {
            var view = this.m_ViewTable.find(viewID);
            if (view == null) {
                return 0;
            }
            var beans = this.m_BeanTable.FindInRangeFilter(view.Bounds().min, view.Bounds().max, new snake.ViewBeanFilter(view));
            return this.BuildBeanSpawnSyncData(beans, bytes, maxSize);
        };
        Scene.prototype.QueryPlayerBeanDevouredData = function (viewID, kill, bytes, maxSize) {
            var view = this.m_ViewTable.find(viewID);
            if (view == null) {
                return 0;
            }
            return this.BuildBeanDevouredSyncData(kill ? view.DevouredKillBeans() : view.DevouredBeans(), kill, bytes, maxSize);
        };
        Scene.prototype.QueryPlayerBeanRefreshData = function (viewID, bytes, maxSize) {
            var view = this.m_ViewTable.find(viewID);
            if (view == null) {
                return 0;
            }
            view.ResetBeanHistory();
            var beans = this.m_BeanTable.FindInRangeFilter(view.Bounds().min, view.Bounds().max, new snake.ViewBeanFilter(view));
            return this.BuildBeanSpawnSyncData(beans, bytes, maxSize);
        };
        return Scene;
    }());
    snake.Scene = Scene;
    __reflect(Scene.prototype, "snake.Scene");
})(snake || (snake = {}));
var snake;
(function (snake) {
    var Bean = (function () {
        function Bean() {
            this.position = new snake.Vector2();
        }
        return Bean;
    }());
    snake.Bean = Bean;
    __reflect(Bean.prototype, "snake.Bean");
    ;
    var BeanDevoured = (function () {
        function BeanDevoured() {
            this.position = new snake.Vector2();
        }
        return BeanDevoured;
    }());
    snake.BeanDevoured = BeanDevoured;
    __reflect(BeanDevoured.prototype, "snake.BeanDevoured");
    ;
    //typedef FixedSpatialItemContainer<Bean> BeanTable;
    //typedef container::list<BeanDevoured> BeanDevouredList;
})(snake || (snake = {}));
var snake;
(function (snake) {
    snake._PI = 3.141592654;
    snake.deg2rad = snake._PI / 180.0;
    snake.rad2deg = 180.0 / snake._PI;
    function min(x, y) {
        return x < y ? x : y;
    }
    snake.min = min;
    function max(x, y) {
        return x > y ? x : y;
    }
    snake.max = max;
    function clamp(value, low, high) {
        return value < low ? low : (value > high ? high : value);
    }
    snake.clamp = clamp;
    function lerp(a, b, t) {
        return t * b + (1.0 - t) * a;
    }
    snake.lerp = lerp;
    function saturate(t) {
        return clamp(t, 0.0, 1.0);
    }
    snake.saturate = saturate;
    function uniform_random(min, max) {
        return min + Math.random() * (max - min);
    }
    snake.uniform_random = uniform_random;
    function gaussian_random(sigma) {
        if (sigma === void 0) { sigma = 1.0; }
        var u1 = Math.random();
        var u2 = Math.random();
        var randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * snake._PI * u2);
        return sigma * randStdNormal;
    }
    snake.gaussian_random = gaussian_random;
})(snake || (snake = {}));
var snake;
(function (snake) {
    var unordered_map = (function () {
        function unordered_map() {
            this.v = new Object();
        }
        unordered_map.prototype.add = function (key, value) {
            this.v[key] = value;
        };
        return unordered_map;
    }());
    snake.unordered_map = unordered_map;
    __reflect(unordered_map.prototype, "snake.unordered_map");
    ;
    var unordered_set = (function () {
        function unordered_set() {
            this.v = new Object();
        }
        unordered_set.prototype.add = function (key, value) {
            this.v[key] = value;
        };
        return unordered_set;
    }());
    snake.unordered_set = unordered_set;
    __reflect(unordered_set.prototype, "snake.unordered_set");
    ;
})(snake || (snake = {}));
var snake;
(function (snake) {
    var sceneManager = new snake.SceneManager();
    //////////////////////////////////////////////////////////////////////////
    // Scene Interface
    function CreateScene(params) {
        if (params != null) {
            return sceneManager.CreateScene(params);
        }
        else {
            return 0;
        }
    }
    snake.CreateScene = CreateScene;
    function SnakeAdjustSceneParams(sceneID, params) {
        if (params != null) {
            var pScene = sceneManager.GetScene(sceneID);
            if (pScene != null) {
                pScene.AdjustSceneParams(params);
            }
        }
    }
    snake.SnakeAdjustSceneParams = SnakeAdjustSceneParams;
    function UpdateScene(sceneID, time) {
        //PROFILE("UpdateScene");
        var pScene = sceneManager.GetScene(sceneID);
        if (pScene != null) {
            pScene.UpdateScene(time);
        }
    }
    snake.UpdateScene = UpdateScene;
    function DeleteScene(sceneID) {
        sceneManager.DeleteScene(sceneID);
    }
    snake.DeleteScene = DeleteScene;
    function DeleteAllBeans(sceneID) {
        var pScene = sceneManager.GetScene(sceneID);
        if (pScene != null) {
            pScene.DeleteAllBeans();
        }
    }
    snake.DeleteAllBeans = DeleteAllBeans;
    function DeleteAllSlithers(sceneID) {
        var pScene = sceneManager.GetScene(sceneID);
        if (pScene != null) {
            pScene.DeleteAllSlithers();
        }
    }
    snake.DeleteAllSlithers = DeleteAllSlithers;
    function CreateSlitherAI(sceneID, initialScore, skinID, aiParams, pos, dir) {
        //PROFILE("CreateSlitherAI");
        var pScene = sceneManager.GetScene(sceneID);
        if (pScene != null && pos != null && dir != null) {
            return pScene.CreateSlitherAI(initialScore, skinID, aiParams, pos, dir);
        }
        else {
            return 0;
        }
    }
    snake.CreateSlitherAI = CreateSlitherAI;
    function CreateSlitherPlayer(sceneID, playerID, initialScore, skinID, pos, dir) {
        //PROFILE("CreateSlitherPlayer");
        var pScene = sceneManager.GetScene(sceneID);
        if (pScene != null && pos != null && dir != null) {
            return pScene.CreateSlitherPlayer(playerID, initialScore, skinID, pos, dir);
        }
        else {
            return false;
        }
    }
    snake.CreateSlitherPlayer = CreateSlitherPlayer;
    function SetSlitherAI(sceneID, playerID, aiParams) {
        //PROFILE("SetSlitherAI");
        var pScene = sceneManager.GetScene(sceneID);
        if (pScene != null) {
            pScene.SetSlitherAI(playerID, aiParams);
        }
    }
    snake.SetSlitherAI = SetSlitherAI;
    function SetSlitherPlayerCmd(sceneID, playerID, targetDir, accelarating) {
        //PROFILE("SetSlitherPlayerCmd");
        var pScene = sceneManager.GetScene(sceneID);
        if (pScene != null && targetDir != null) {
            pScene.SetSlitherPlayerCmd(playerID, targetDir, accelarating);
        }
    }
    snake.SetSlitherPlayerCmd = SetSlitherPlayerCmd;
    function FindBestFitPosition(sceneID, emptySize, maxTryCount, outsideFirst, optimalPos, outPos) {
        //PROFILE("FindBestFitPosition");
        var pScene = sceneManager.GetScene(sceneID);
        if (pScene != null && outPos != null) {
            return pScene.FindBestFitPosition(emptySize, maxTryCount, outsideFirst, optimalPos == null ? new snake.Vector2() : optimalPos, outPos);
        }
        return false;
    }
    snake.FindBestFitPosition = FindBestFitPosition;
    function GetSlitherInfo(sceneID, playerID) {
        //PROFILE("GetSlitherInfo");
        var pScene = sceneManager.GetScene(sceneID);
        if (pScene != null) {
            return pScene.GetHistorySlitherInfo(playerID);
        }
        return null;
    }
    snake.GetSlitherInfo = GetSlitherInfo;
    function SnakeGenerateBean(sceneID, pos, valVisual, valReal) {
        //PROFILE("GenerateBean");
        var pScene = sceneManager.GetScene(sceneID);
        if (pScene != null && pos != null) {
            pScene.GenerateBean(pos, valVisual, valReal);
        }
    }
    snake.SnakeGenerateBean = SnakeGenerateBean;
    function IsPlayerAlive(sceneID, playerID) {
        var pScene = sceneManager.GetScene(sceneID);
        if (pScene != null) {
            return pScene.IsPlayerAlive(playerID);
        }
        else {
            return false;
        }
    }
    snake.IsPlayerAlive = IsPlayerAlive;
    function GetBeanCount(sceneID) {
        if (sceneID == 0) {
            return sceneManager.GetBeanCount();
        }
        else {
            var pScene = sceneManager.GetScene(sceneID);
            if (pScene != null) {
                return pScene.GetBeanCount();
            }
            else {
                return 0;
            }
        }
    }
    snake.GetBeanCount = GetBeanCount;
    function GetAICount(sceneID) {
        if (sceneID == 0) {
            return sceneManager.GetAICount();
        }
        else {
            var pScene = sceneManager.GetScene(sceneID);
            if (pScene != null) {
                return pScene.GetAICount();
            }
            else {
                return 0;
            }
        }
    }
    snake.GetAICount = GetAICount;
    function GetPlayerCount(sceneID) {
        if (sceneID == 0) {
            return sceneManager.GetPlayerCount();
        }
        else {
            var pScene = sceneManager.GetScene(sceneID);
            if (pScene != null) {
                return pScene.GetPlayerCount();
            }
            else {
                return 0;
            }
        }
    }
    snake.GetPlayerCount = GetPlayerCount;
    function QueryRankSyncData(sceneID, count, buffer, maxSize) {
        //PROFILE("QueryRankSyncData");
        var pScene = sceneManager.GetScene(sceneID);
        if (pScene != null) {
            return pScene.QueryRankSyncData(count, buffer, maxSize);
        }
        return 0;
    }
    snake.QueryRankSyncData = QueryRankSyncData;
    function QueryMiniMapSyncData(sceneID, count, buffer, maxSize) {
        //PROFILE("QueryMiniMapSyncData");
        var pScene = sceneManager.GetScene(sceneID);
        if (pScene != null) {
            return pScene.QueryMiniMapSyncData(count, buffer, maxSize);
        }
        return 0;
    }
    snake.QueryMiniMapSyncData = QueryMiniMapSyncData;
    //////////////////////////////////////////////////////////////////////////
    // View Interface
    function CreateView(sceneID, playerID) {
        var pScene = sceneManager.GetScene(sceneID);
        if (pScene != null) {
            return pScene.CreateView(playerID);
        }
        return 0;
    }
    snake.CreateView = CreateView;
    function DeleteView(sceneID, viewID) {
        var pScene = sceneManager.GetScene(sceneID);
        if (pScene != null) {
            return pScene.DeleteView(viewID);
        }
    }
    snake.DeleteView = DeleteView;
    function QueryPlayerBirthDeath(sceneID, viewID, buffer, maxSize) {
        //PROFILE("QueryPlayerBirthDeath");
        var pScene = sceneManager.GetScene(sceneID);
        if (pScene != null) {
            return pScene.QueryPlayerBirthDeath(viewID, buffer, maxSize);
        }
        return 0;
    }
    snake.QueryPlayerBirthDeath = QueryPlayerBirthDeath;
    function QueryPlayerHeadSyncData(sceneID, viewID, buffer, maxSize) {
        //PROFILE("QueryPlayerHeadSyncData");
        var pScene = sceneManager.GetScene(sceneID);
        if (pScene != null) {
            return pScene.QueryPlayerHeadSyncData(viewID, buffer, maxSize);
        }
        return 0;
    }
    snake.QueryPlayerHeadSyncData = QueryPlayerHeadSyncData;
    function QueryPlayerInfoSyncData(sceneID, viewID, buffer, maxSize) {
        //PROFILE("QueryPlayerInfoSyncData");
        var pScene = sceneManager.GetScene(sceneID);
        if (pScene != null) {
            return pScene.QueryPlayerInfoSyncData(viewID, buffer, maxSize);
        }
        return 0;
    }
    snake.QueryPlayerInfoSyncData = QueryPlayerInfoSyncData;
    function QueryPlayerBodySyncData(sceneID, viewID, buffer, maxSize) {
        //PROFILE("QueryPlayerBodySyncData");
        var pScene = sceneManager.GetScene(sceneID);
        if (pScene != null) {
            return pScene.QueryPlayerBodySyncData(viewID, buffer, maxSize);
        }
        return 0;
    }
    snake.QueryPlayerBodySyncData = QueryPlayerBodySyncData;
    function QueryPlayerBodySyncBaseData(sceneID, viewID, buffer, maxSize) {
        //PROFILE("QueryPlayerBodySyncBaseData");
        return 0;
    }
    snake.QueryPlayerBodySyncBaseData = QueryPlayerBodySyncBaseData;
    function QueryPlayerBodySyncFactorData(sceneID, viewID, buffer, maxSize) {
        //PROFILE("QueryPlayerBodySyncFactorData");
        return 0;
    }
    snake.QueryPlayerBodySyncFactorData = QueryPlayerBodySyncFactorData;
    function QueryPlayerBeanSpawnData(sceneID, viewID, buffer, maxSize) {
        //PROFILE("QueryPlayerBeanSpawnData");
        var pScene = sceneManager.GetScene(sceneID);
        if (pScene != null) {
            return pScene.QueryPlayerBeanSpawnData(viewID, buffer, maxSize);
        }
        return 0;
    }
    snake.QueryPlayerBeanSpawnData = QueryPlayerBeanSpawnData;
    function QueryPlayerBeanDevouredData(sceneID, viewID, kill, buffer, maxSize) {
        //PROFILE("QueryPlayerBeanDevouredData");
        var pScene = sceneManager.GetScene(sceneID);
        if (pScene != null) {
            return pScene.QueryPlayerBeanDevouredData(viewID, kill, buffer, maxSize);
        }
        return 0;
    }
    snake.QueryPlayerBeanDevouredData = QueryPlayerBeanDevouredData;
    function QueryPlayerBeanRefreshData(sceneID, viewID, buffer, maxSize) {
        //PROFILE("QueryPlayerBeanRefreshData");
        var pScene = sceneManager.GetScene(sceneID);
        if (pScene != null) {
            return pScene.QueryPlayerBeanRefreshData(viewID, buffer, maxSize);
        }
        return 0;
    }
    snake.QueryPlayerBeanRefreshData = QueryPlayerBeanRefreshData;
})(snake || (snake = {}));
var snake;
(function (snake) {
    var SceneParams = (function () {
        function SceneParams() {
        }
        return SceneParams;
    }());
    snake.SceneParams = SceneParams;
    __reflect(SceneParams.prototype, "snake.SceneParams");
    var SceneAdjustableParams = (function () {
        function SceneAdjustableParams() {
        }
        return SceneAdjustableParams;
    }());
    snake.SceneAdjustableParams = SceneAdjustableParams;
    __reflect(SceneAdjustableParams.prototype, "snake.SceneAdjustableParams");
    var AIParams = (function () {
        function AIParams() {
        }
        return AIParams;
    }());
    snake.AIParams = AIParams;
    __reflect(AIParams.prototype, "snake.AIParams");
    var SlitherInfo = (function () {
        function SlitherInfo() {
        }
        return SlitherInfo;
    }());
    snake.SlitherInfo = SlitherInfo;
    __reflect(SlitherInfo.prototype, "snake.SlitherInfo");
    ;
    var BirthDeathType;
    (function (BirthDeathType) {
        BirthDeathType[BirthDeathType["EnterView"] = 1] = "EnterView";
        BirthDeathType[BirthDeathType["ExitView"] = 2] = "ExitView";
    })(BirthDeathType = snake.BirthDeathType || (snake.BirthDeathType = {}));
    ;
    var BirthDeathInfo = (function () {
        function BirthDeathInfo() {
        }
        return BirthDeathInfo;
    }());
    snake.BirthDeathInfo = BirthDeathInfo;
    __reflect(BirthDeathInfo.prototype, "snake.BirthDeathInfo");
})(snake || (snake = {}));
var snake;
(function (snake) {
    var UIntSet = (function () {
        function UIntSet() {
        }
        UIntSet.prototype.Initialize = function (max) {
            this.m_Max = max;
            this.m_Bucket = [];
            this.m_Bucket.length = max;
            this.m_Count = 0;
        };
        UIntSet.prototype.GetBucket = function (v) {
            var index = v % this.m_Max;
            var bucket = this.m_Bucket[index];
            if (bucket) {
                return bucket;
            }
            bucket = this.m_Bucket[index] = new Array();
            return bucket;
        };
        UIntSet.prototype.Add = function (v) {
            var bucket = this.GetBucket(v);
            if (bucket.indexOf(v) == -1) {
                bucket.push(v);
                ++this.m_Count;
            }
        };
        UIntSet.prototype.Remove = function (v) {
            var bucket = this.GetBucket(v);
            var index = bucket.indexOf(v);
            if (index != -1) {
                bucket.splice(index, 1);
                --this.m_Count;
            }
        };
        UIntSet.prototype.Contains = function (v) {
            var bucket = this.GetBucket(v);
            return bucket.indexOf(v) != -1;
        };
        UIntSet.prototype.Clear = function () {
            this.m_Bucket.length = 0;
            this.m_Bucket.length = this.m_Max;
            this.m_Count = 0;
        };
        UIntSet.prototype.Count = function () {
            return this.m_Count;
        };
        return UIntSet;
    }());
    snake.UIntSet = UIntSet;
    __reflect(UIntSet.prototype, "snake.UIntSet");
    ;
})(snake || (snake = {}));
var snake;
(function (snake) {
    snake.FLT_MIN = 1.175494351e-38;
    snake.FLT_MAX = 3.402823466e+38;
    var AABB = (function () {
        function AABB() {
            this.min = new snake.Vector2(snake.FLT_MAX, snake.FLT_MAX);
            this.max = new snake.Vector2(-snake.FLT_MAX, -snake.FLT_MAX);
        }
        AABB.createAABB = function (_min, _max) {
            var ab = new AABB();
            ab.min = _min;
            ab.max = _max;
            return ab;
        };
        AABB.createAB = function (a) {
            var ab = new AABB();
            ab.min = a.min;
            ab.max = a.max;
            return ab;
        };
        AABB.prototype.equal = function (a) {
            this.min.SetVec(a.min);
            this.max.SetVec(a.max);
            return this;
        };
        AABB.prototype.Clear = function () {
            this.min = new snake.Vector2(snake.FLT_MAX, snake.FLT_MAX);
            this.max = new snake.Vector2(-snake.FLT_MAX, -snake.FLT_MAX);
        };
        AABB.prototype.IsValid = function () {
            return this.max.x >= this.min.x && this.max.y >= this.min.y;
        };
        AABB.prototype.Encapuslate = function (pt) {
            var vmin = this.min;
            var vmax = this.max;
            vmin.x = snake.min(vmin.x, pt.x);
            vmin.y = snake.min(vmin.y, pt.y);
            vmax.x = snake.max(vmax.x, pt.x);
            vmax.y = snake.max(vmax.y, pt.y);
        };
        AABB.prototype.Contains = function (pt) {
            var min = this.min;
            var max = this.max;
            return min.x <= pt.x && min.y <= pt.y &&
                pt.x <= max.x && pt.y <= max.y;
        };
        AABB.prototype.Extents = function () {
            return this.max.sub(this.min).mul(0.5);
        };
        AABB.prototype.Center = function () {
            return this.max.add(this.min).mul(0.5);
        };
        AABB.prototype.Size = function () {
            return this.max.sub(this.min);
        };
        AABB.prototype.Enlarge = function (extent) {
            if (typeof extent == "number") {
                var offset = extent;
                this.min.subAssignment(offset);
                this.max.addAssignment(offset);
            }
            else {
                this.min.subAssignment(extent);
                this.max.addAssignment(extent);
            }
        };
        AABB.prototype.Intersect = function (aabb) {
            var extent = aabb.Extents();
            var pt = aabb.Center();
            var tmin = this.min.sub(extent);
            var tmax = this.max.add(extent);
            return (tmin.x <= pt.x && tmin.y <= pt.y && pt.x <= tmax.x && pt.y <= tmax.y);
        };
        AABB.prototype.IntersectVec = function (pt, r) {
            var cent = this.Center();
            var sphereCenterRelBox = pt.sub(cent);
            var extents = this.Extents();
            var boxPoint;
            if (sphereCenterRelBox.x < -extents.x)
                boxPoint.x = -extents.x;
            else if (sphereCenterRelBox.x > extents.x)
                boxPoint.x = extents.x;
            else
                boxPoint.x = sphereCenterRelBox.x;
            if (sphereCenterRelBox.y < -extents.y)
                boxPoint.y = -extents.y;
            else if (sphereCenterRelBox.y > extents.y)
                boxPoint.y = extents.y;
            else
                boxPoint.y = sphereCenterRelBox.y;
            var dist = sphereCenterRelBox.subAssignment(boxPoint);
            return dist.SquareMagnitude() < r * r;
        };
        return AABB;
    }());
    snake.AABB = AABB;
    __reflect(AABB.prototype, "snake.AABB");
})(snake || (snake = {}));
var snake;
(function (snake) {
    var Vector2 = (function () {
        function Vector2(x, y) {
            if (x === void 0) { x = 0.0; }
            if (y === void 0) { y = 0.0; }
            this.x = x;
            this.y = y;
        }
        Vector2.prototype.SetVec = function (a) {
            this.x = a.x;
            this.y = a.y;
        };
        Object.defineProperty(Vector2.prototype, "vec", {
            set: function (a) {
                this.x = a.x;
                this.y = a.y;
            },
            enumerable: true,
            configurable: true
        });
        Vector2.prototype.SetTo = function (x, y) {
            this.x = x;
            this.y = y;
        };
        Vector2.prototype.equal = function (a) {
            return this.x == a.x && this.y == a.y;
        };
        Vector2.prototype.noequal = function (a) {
            return this.x != a.x && this.y != a.y;
        };
        Vector2.prototype.add = function (rhs) {
            if (typeof rhs == "number") {
                return new Vector2(this.x + rhs, this.y + rhs);
            }
            return new Vector2(this.x + rhs.x, this.y + rhs.y);
        };
        Vector2.prototype.sub = function (rhs) {
            if (typeof rhs == "number") {
                return new Vector2(this.x - rhs, this.y - rhs);
            }
            return new Vector2(this.x - rhs.x, this.y - rhs.y);
        };
        Vector2.prototype.mul = function (rhs) {
            if (typeof rhs == "number") {
                return new Vector2(this.x * rhs, this.y * rhs);
            }
            return new Vector2(this.x * rhs.x, this.y * rhs.y);
        };
        Vector2.prototype.div = function (rhs) {
            if (typeof rhs == "number") {
                return new Vector2(this.x / rhs, this.y / rhs);
            }
            return new Vector2(this.x / rhs.x, this.y / rhs.y);
        };
        Vector2.prototype.addAssignment = function (rhs) {
            if (typeof rhs == "number") {
                this.x += rhs;
                this.y += rhs;
            }
            else {
                this.x += rhs.x;
                this.y += rhs.y;
            }
            return this;
        };
        Vector2.prototype.subAssignment = function (rhs) {
            if (typeof rhs == "number") {
                this.x -= rhs;
                this.y -= rhs;
            }
            else {
                this.x -= rhs.x;
                this.y -= rhs.y;
            }
            return this;
        };
        Vector2.prototype.mulAssignment = function (rhs) {
            if (typeof rhs == "number") {
                this.x *= rhs;
                this.y *= rhs;
            }
            else {
                this.x *= rhs.x;
                this.y *= rhs.y;
            }
            return this;
        };
        Vector2.prototype.divAssignment = function (rhs) {
            if (typeof rhs == "number") {
                this.x /= rhs;
                this.y /= rhs;
            }
            else {
                this.x /= rhs.x;
                this.y /= rhs.y;
            }
            return this;
        };
        Vector2.prototype.Magnitude = function () {
            var x = this.x;
            var y = this.y;
            return Math.sqrt(x * x + y * y);
        };
        Vector2.prototype.SquareMagnitude = function () {
            var x = this.x;
            var y = this.y;
            return x * x + y * y;
        };
        Vector2.prototype.IsZero = function () {
            return this.x == 0.0 && this.y == 0.0;
        };
        Vector2.prototype.IsValid = function () {
            if (isNaN(this.x) || isNaN(this.y)) {
                return false;
            }
            else {
                return true;
            }
        };
        return Vector2;
    }());
    snake.Vector2 = Vector2;
    __reflect(Vector2.prototype, "snake.Vector2");
    ;
    function Dot(lhs, rhs) {
        return lhs.x * rhs.x + lhs.y * rhs.y;
    }
    snake.Dot = Dot;
    function operatorMul(k, rhs) {
        return rhs.mul(k);
    }
    snake.operatorMul = operatorMul;
    function Normalize(v) {
        var magSq = v.SquareMagnitude();
        if (magSq > 0.000001) {
            var oneOverMag = 1.0 / Math.sqrt(magSq);
            return v.mul(oneOverMag);
        }
        else {
            return new Vector2(1.0, 0.0);
        }
    }
    snake.Normalize = Normalize;
    function Reflect(v, n) {
        return v.add(n.mul(-2.0 * Dot(v, n)));
    }
    snake.Reflect = Reflect;
    function Right(v) {
        return new Vector2(v.y, -v.x);
    }
    snake.Right = Right;
    function Distance(a, b) {
        return a.sub(b).Magnitude();
    }
    snake.Distance = Distance;
    function Slerp(vectorA, vectorB, t) {
        var cosAngle = snake.clamp(Dot(vectorA, vectorB), -0.99, 0.99);
        var angle = Math.acos(cosAngle);
        var am = vectorA.mul(Math.sin((1 - t) * angle));
        var bm = vectorB.mul(Math.sin(t * angle));
        var ret = (am.add(bm)).div(Math.sin(angle));
        return ret.IsValid() ? ret : vectorA;
    }
    snake.Slerp = Slerp;
    function RotateTowards(rotateFrom, rotateTo, maxDeltaTheta) {
        var cosAngle = snake.clamp(Dot(rotateFrom, rotateTo), -0.99, 0.99);
        var angle = Math.acos(cosAngle);
        if (angle <= maxDeltaTheta) {
            return rotateTo;
        }
        var t = maxDeltaTheta / angle;
        var fs = rotateFrom.mul(Math.sin((1 - t) * angle));
        var ts = rotateTo.mul(Math.sin(t * angle));
        var ret = fs.add(ts).div(Math.sin(angle));
        return ret.IsValid() ? ret : rotateFrom;
    }
    snake.RotateTowards = RotateTowards;
    function random_on_unitcircle() {
        var r = snake.uniform_random(0.0, 2.0 * snake._PI);
        return new Vector2(Math.cos(r), Math.sin(r));
    }
    snake.random_on_unitcircle = random_on_unitcircle;
    function random_in_unitcircle() {
        var r = snake.uniform_random(0.0, 2.0 * snake._PI);
        var d = snake.uniform_random(0.0, 1.0);
        return new Vector2(d * Math.cos(r), d * Math.sin(r));
    }
    snake.random_in_unitcircle = random_in_unitcircle;
    function random_gaussian_disk(sigma) {
        if (sigma === void 0) { sigma = 1.0; }
        return new Vector2(snake.gaussian_random(sigma), snake.gaussian_random(sigma));
    }
    snake.random_gaussian_disk = random_gaussian_disk;
})(snake || (snake = {}));
var snake;
(function (snake) {
    var View = (function () {
        function View() {
            this.m_BeanDevouredList = [];
            this.m_KillBeanDevouredList = [];
            this.m_SlithersInView = [];
            this.m_AABB = new snake.AABB();
            this.m_ViewID = 0;
            this.m_SlitherID = 0;
        }
        View.prototype.Initialize = function (pScene, viewID, slitherID) {
            this.m_pScene = pScene;
            this.m_ViewID = viewID;
            this.m_SlitherID = slitherID;
            this.m_BeanDevouredList.length = 0;
            this.m_BeanQueriedTable = new snake.UIntSet();
            this.m_BeanQueriedTable.Initialize(snake.ID_BUCKET_NUM);
            if (this.m_SlitherID == 0) {
                this.m_AABB = new snake.AABB();
                this.m_AABB.min = this.m_pScene.Center().sub(this.m_pScene.Params().radius);
                this.m_AABB.max = this.m_pScene.Center().sub(this.m_pScene.Params().radius);
            }
        };
        View.prototype.Update = function () {
            var slither = this.m_pScene.FindSlither(this.m_SlitherID);
            if (slither != null) {
                var center = slither.Position();
                var extent = this.m_pScene.WidthToView(slither.Width()) * snake.VIEW_ASPECT;
                this.m_AABB.min = center.sub(extent);
                this.m_AABB.max = center.add(extent);
            }
        };
        View.prototype.GetSlitherInfo = function () {
            return this.m_pScene.GetHistorySlitherInfo(this.m_SlitherID);
        };
        View.prototype.ResetBeanHistory = function () {
            this.m_BeanQueriedTable.Clear();
            this.m_KillBeanDevouredList.length = 0;
            this.m_BeanDevouredList.length = 0;
        };
        View.prototype.FilterBean = function (bean) {
            if (!this.m_BeanQueriedTable.Contains(bean.id)) {
                this.m_BeanQueriedTable.Add(bean.id);
                return true;
            }
            return false;
        };
        View.prototype.NotifyBeanDevoured = function (beanDevoured) {
            var size = beanDevoured.length;
            for (var i = 0; i < size; ++i) {
                var it = beanDevoured[i];
                if (this.m_BeanQueriedTable.Contains(it.id)) {
                    if (it.kill) {
                        this.m_KillBeanDevouredList.push(it);
                    }
                    else {
                        this.m_BeanDevouredList.push(it);
                    }
                    this.m_BeanQueriedTable.Remove(it.id);
                }
            }
        };
        View.prototype.Bounds = function () {
            return this.m_AABB;
        };
        View.prototype.DevouredBeans = function () {
            return this.m_BeanDevouredList;
        };
        View.prototype.DevouredKillBeans = function () {
            return this.m_KillBeanDevouredList;
        };
        View.prototype.SlithersInView = function () {
            return this.m_SlithersInView;
        };
        return View;
    }());
    snake.View = View;
    __reflect(View.prototype, "snake.View");
    var ViewBeanFilter = (function (_super) {
        __extends(ViewBeanFilter, _super);
        function ViewBeanFilter(v) {
            var _this = _super.call(this) || this;
            _this.view = v;
            return _this;
        }
        ViewBeanFilter.prototype.operator = function (bean) {
            return this.view.FilterBean(bean);
        };
        return ViewBeanFilter;
    }(snake.DefaultFilter));
    snake.ViewBeanFilter = ViewBeanFilter;
    __reflect(ViewBeanFilter.prototype, "snake.ViewBeanFilter");
})(snake || (snake = {}));
